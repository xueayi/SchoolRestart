import App from './app.js';
import Life from './modules/life.js';

globalThis.$$eventMap = new Map();
globalThis.$$event = (tag, data) => {
    const listener = $$eventMap.get(tag);
    if(listener) listener.forEach(fn=>fn(data));
}
globalThis.$$on = (tag, fn) => {
    let listener = $$eventMap.get(tag);
    if(!listener) {
        listener = new Set();
        $$eventMap.set(tag, listener);
    }
    listener.add(fn);
}
globalThis.$$off = (tag, fn) => {
    const listener = $$eventMap.get(tag);
    if(listener) listener.delete(fn);
}

globalThis.$$copy = async text => {
    const result = await navigator.permissions.query({ name: "clipboard-write" })
    if (result.state == "granted" || result.state == "prompt") {
        navigator.clipboard.writeText(text)
        return true;
    }
    const input = document.createElement('input');
    input.setAttribute('style', 'opacity: 0;');
    document.body.appendChild(input);
    input.value = text;
    input.select();
    const r = document.execCommand("copy");
    document.body.removeChild(input);
    return r;
}

globalThis.$$read = async ()=>{
    const result = await navigator.permissions.query({ name: "clipboard-read" })
    if (result.state == "granted" || result.state == "prompt") {
        return await navigator.clipboard.readText();
    }
    const input = document.createElement('input');
    input.setAttribute('style', 'opacity: 0;');
    document.body.appendChild(input);
    input.focus();
    const r = document.execCommand("paste");
    const text = input.value;
    document.body.removeChild(input);
    return r?text:r;
};

const core = new Life();
const game = new App();
globalThis.core = core;
globalThis.game = game;

const query = {};
location.search.substr(1).split('&').forEach(item => {
    const parts = item.split('=');
    query[parts[0]] = parts[1];
});

core.config({
    defaultPropertyPoints: 20,
    talentSelectLimit: 3,
    propertyAllocateLimit: [0, 10],
    defaultPropertys: { LOV: 3, VIT: 10 },
    talentConfig: {
        talentPullCount: 10,
        talentRate: { 1:100, 2:10, 3:1, total: 1000 },
        additions: {
            TMS: [
                [ 10, { 2: 1 }],
                [ 30, { 2: 2 }],
                [ 50, { 2: 3 }],
                [ 70, { 2: 4 }],
                [100, { 2: 5 }],
            ],
            CACHV: [
                [ 10, { 2: 1 }],
                [ 30, { 2: 2 }],
                [ 50, { 2: 3 }],
                [ 70, { 2: 4 }],
                [100, { 2: 5 }],
            ]
        },
    },
    propertyConfig: {
        judge: {
            RTLT: [
                [    0, 0],
                [  0.3, 1],
                [  0.6, 2],
                [  0.9, 3],
            ],
            REVT: [
                [    0, 0],
                [  0.2, 1],
                [  0.4, 2],
                [  0.6, 3],
            ],
            TMS: [
                [    0, 0, 'UI_Remake_Times_Judge_Level_0'],
                [   10, 1, 'UI_Remake_Times_Judge_Level_1'],
                [   30, 1, 'UI_Remake_Times_Judge_Level_2'],
                [   50, 2, 'UI_Remake_Times_Judge_Level_3'],
                [   70, 2, 'UI_Remake_Times_Judge_Level_4'],
                [  100, 3, 'UI_Remake_Times_Judge_Level_5'],
            ],
            CACHV: [
                [    0, 0, 'UI_Achievement_Count_Judge_Level_0'],
                [   10, 1, 'UI_Achievement_Count_Judge_Level_1'],
                [   30, 1, 'UI_Achievement_Count_Judge_Level_2'],
                [   50, 2, 'UI_Achievement_Count_Judge_Level_3'],
                [   70, 2, 'UI_Achievement_Count_Judge_Level_4'],
                [  100, 3, 'UI_Achievement_Count_Judge_Level_5'],
            ],
            HAPR: [
                [   0, 0, 'UI_APR_Judge_Level_0'],
                [   3, 0, 'UI_APR_Judge_Level_1'],
                [   6, 0, 'UI_APR_Judge_Level_2'],
                [  10, 0, 'UI_APR_Judge_Level_3'],
                [  15, 1, 'UI_APR_Judge_Level_4'],
                [  25, 2, 'UI_APR_Judge_Level_5'],
                [  40, 3, 'UI_APR_Judge_Level_6'],
            ],
            HKNW: [
                [   0, 0, 'UI_KNW_Judge_Level_0'],
                [   3, 0, 'UI_KNW_Judge_Level_1'],
                [   6, 0, 'UI_KNW_Judge_Level_2'],
                [  10, 0, 'UI_KNW_Judge_Level_3'],
                [  15, 1, 'UI_KNW_Judge_Level_4'],
                [  25, 2, 'UI_KNW_Judge_Level_5'],
                [  40, 3, 'UI_KNW_Judge_Level_6'],
            ],
            HSOC: [
                [   0, 0, 'UI_SOC_Judge_Level_0'],
                [   3, 0, 'UI_SOC_Judge_Level_1'],
                [   6, 0, 'UI_SOC_Judge_Level_2'],
                [  10, 0, 'UI_SOC_Judge_Level_3'],
                [  15, 1, 'UI_SOC_Judge_Level_4'],
                [  25, 2, 'UI_SOC_Judge_Level_5'],
                [  40, 3, 'UI_SOC_Judge_Level_6'],
            ],
            HCHM: [
                [   0, 0, 'UI_CHM_Judge_Level_0'],
                [   3, 0, 'UI_CHM_Judge_Level_1'],
                [   6, 0, 'UI_CHM_Judge_Level_2'],
                [  10, 0, 'UI_CHM_Judge_Level_3'],
                [  15, 1, 'UI_CHM_Judge_Level_4'],
                [  25, 2, 'UI_CHM_Judge_Level_5'],
                [  40, 3, 'UI_CHM_Judge_Level_6'],
            ],
            HLOV: [
                [   0, 0, 'UI_LOV_Judge_Level_0'],
                [   3, 0, 'UI_LOV_Judge_Level_1'],
                [   6, 0, 'UI_LOV_Judge_Level_2'],
                [  10, 0, 'UI_LOV_Judge_Level_3'],
                [  15, 1, 'UI_LOV_Judge_Level_4'],
                [  25, 2, 'UI_LOV_Judge_Level_5'],
                [  40, 3, 'UI_LOV_Judge_Level_6'],
            ],
            HSEM: [
                [   0, 0, 'UI_SEM_Judge_Level_0'],
                [   4, 0, 'UI_SEM_Judge_Level_1'],
                [  10, 0, 'UI_SEM_Judge_Level_2'],
                [  28, 0, 'UI_SEM_Judge_Level_3'],
                [  46, 1, 'UI_SEM_Judge_Level_4'],
                [  70, 2, 'UI_SEM_Judge_Level_5'],
                [ 101, 3, 'UI_SEM_Judge_Level_6'],
            ],
            SUM: [
                [   0, 0, 'UI_SUM_Judge_Level_0'],
                [  40, 0, 'UI_SUM_Judge_Level_1'],
                [  80, 0, 'UI_SUM_Judge_Level_2'],
                [ 120, 1, 'UI_SUM_Judge_Level_3'],
                [ 180, 2, 'UI_SUM_Judge_Level_4'],
                [ 250, 2, 'UI_SUM_Judge_Level_5'],
                [ 350, 3, 'UI_SUM_Judge_Level_6'],
            ],
        },
    },
    characterConfig: {
        characterPullCount: 3,
        rateableKnife: 10,
        propertyWeight: [
            [ 0, 1],
            [ 1, 2],
            [ 2, 3],
            [ 3, 4],
            [ 4, 5],
            [ 5, 6],
            [ 6, 5],
            [ 7, 4],
            [ 8, 3],
            [ 9, 2],
            [10, 1],
        ],
        talentWeight: [
            [ 1, 1],
            [ 2, 2],
            [ 3, 3],
            [ 4, 2],
            [ 5, 1],
        ],
    },
});
game.start(query);
