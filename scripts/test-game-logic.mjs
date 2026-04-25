import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = resolve(__dirname, '../public/data');

class MockLocalStorage {
    #data = {};
    getItem(k) { return this.#data[k] ?? null; }
    setItem(k, v) { this.#data[k] = v; }
}
globalThis.localStorage = new MockLocalStorage();

function loadJson(path) {
    return JSON.parse(readFileSync(resolve(dataDir, path), 'utf8'));
}

const age = loadJson('zh-cn/age.json');
const talents = loadJson('zh-cn/talents.json');
const events = loadJson('zh-cn/events.json');
const achievement = loadJson('zh-cn/achievement.json');
const character = loadJson('zh-cn/character.json');

console.log('=== Data Validation ===');
console.log('Semesters:', Object.keys(age).length);
console.log('Events:', Object.keys(events).length);
console.log('Talents:', Object.keys(talents).length);
console.log('Achievements:', Object.keys(achievement).length);
console.log('Characters:', Object.keys(character).length);

// Validate event references in age data
let missingEvents = 0;
let totalEventRefs = 0;
for (const [sem, data] of Object.entries(age)) {
    const evts = (data.event || []).filter(e => e !== '');
    for (const e of evts) {
        totalEventRefs++;
        const eid = String(e).split('*')[0];
        if (!events[eid]) missingEvents++;
    }
}
console.log(`\nEvent refs: ${totalEventRefs} total, ${missingEvents} missing`);

// Validate talent references in character data
let missingTalents = 0;
for (const [id, c] of Object.entries(character)) {
    for (const t of (c.talent || [])) {
        if (!talents[t]) {
            missingTalents++;
            console.log(`  Character ${id} (${c.name}) references missing talent ${t}`);
        }
    }
}
console.log(`Character talent refs: ${missingTalents} missing`);

// Validate branch targets
let missingBranch = 0;
for (const [id, e] of Object.entries(events)) {
    if (e.branch) {
        for (const b of e.branch) {
            if (typeof b === 'string' && b.includes(':')) {
                const targetId = b.split(':')[1];
                if (!events[targetId]) {
                    missingBranch++;
                    console.log(`  Event ${id} branch target ${targetId} missing`);
                }
            }
        }
    }
}
console.log(`Branch target refs: ${missingBranch} missing`);

// Simulate a basic game flow
console.log('\n=== Simulating Game Flow ===');
const simData = {};
for (const a in age) {
    let { event: evtList, talent: tltList } = age[a];
    if (!Array.isArray(evtList)) evtList = evtList?.split(',') || [];
    evtList = evtList.filter(e => e !== '').map(v => {
        const value = `${v}`.split('*').map(n => Number(n));
        if (value.length === 1) value.push(1);
        return value;
    });
    if (!Array.isArray(tltList)) tltList = tltList?.split(',') || [];
    tltList = tltList.map(v => Number(v));
    simData[a] = { event: evtList, talent: tltList };
}

let sem = 0;
let stats = { APR: 0, KNW: 0, SOC: 0, CHM: 0, LOV: 3, VIT: 10 };
let errors = 0;
for (let s = 1; s <= 20; s++) {
    sem = s;
    const semEntry = simData[s];
    if (!semEntry) {
        console.log(`  ERROR: No data for semester ${s}`);
        errors++;
        continue;
    }
    
    if (semEntry.event.length === 0) {
        console.log(`  WARNING: No events for semester ${s}`);
        continue;
    }
    
    // Pick a random event
    const [eventId] = semEntry.event[Math.floor(Math.random() * semEntry.event.length)];
    const event = events[eventId];
    if (!event) {
        console.log(`  ERROR: Event ${eventId} not found for semester ${s}`);
        errors++;
        continue;
    }
    
    if (event.effect) {
        for (const [prop, val] of Object.entries(event.effect)) {
            if (prop in stats) stats[prop] += val;
        }
    }
}

console.log(`\nSimulation complete - ${errors} errors`);
console.log('Final stats:', stats);
console.log(`Semester reached: ${sem}`);

if (errors === 0 && missingEvents === 0 && missingTalents === 0 && missingBranch === 0) {
    console.log('\n✓ All validations passed!');
} else {
    console.log('\n✗ Some issues found - see above');
}
