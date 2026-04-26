function parseChoiceEffect(s) {
    if (s == null || s === '') return undefined;
    const out = {};
    for (const part of String(s).split(',')) {
        const seg = part.split(':');
        if (seg.length < 2) continue;
        const k = seg[0].trim();
        const v = Number(seg[1].trim());
        if (k && !Number.isNaN(v)) out[k] = v;
    }
    return Object.keys(out).length ? out : undefined;
}

class Event {
    constructor(system) {
        this.#system = system;
    }

    #system;
    #events;

    initial({events}) {
        this.#events = events;
        for(const id in events) {
            const event = events[id];
            if(event.branch) {
                event.branch = event.branch.map(b=>{
                    b = b.split(':');
                    b[1] = Number(b[1]);
                    return b;
                });
            }
            if(event.choiceText) {
                event.choices = event.choiceText.map((text, i) => ({
                    text,
                    effect: parseChoiceEffect(event.choiceEffect?.[i]),
                    next: event.choiceNext?.[i] ? Number(event.choiceNext[i]) : null,
                })).filter(c => c.text);
                delete event.choiceText;
                delete event.choiceEffect;
                delete event.choiceNext;
            }
        }
        return this.count;
    }

    get count() {
        return Object.keys(this.#events).length;
    }

    getChoiceIds() {
        return Object.entries(this.#events)
            .filter(([, e]) => e.isChoice)
            .map(([id]) => Number(id));
    }

    getChoiceIdsBySemRange(semMin, semMax) {
        return Object.entries(this.#events)
            .filter(([, e]) => e.isChoice)
            .filter(([, e]) => {
                if (!e.include) return true;
                const semMatch = e.include.match(/SEM>=(\d+)&SEM<=(\d+)/);
                if (!semMatch) return true;
                const lo = Number(semMatch[1]);
                const hi = Number(semMatch[2]);
                return !(hi < semMin || lo > semMax);
            })
            .map(([id]) => Number(id));
    }

    check(eventId) {
        const { include, exclude, NoRandom } = this.get(eventId);
        if(NoRandom) return false;
        if(exclude && this.#system.check(exclude)) return false;
        if(include) return this.#system.check(include);
        return true;
    }

    get(eventId) {
        const event = this.#events[eventId];
        if(!event) throw new Error(`[ERROR] No Event[${eventId}]`);
        return this.#system.clone(event);
    }

    information(eventId) {
        const { event: description } = this.get(eventId)
        return { description };
    }

    do(eventId) {
        const { effect, branch, event: description, postEvent, grade, isChoice, choices } = this.get(eventId);
        if(isChoice && choices && choices.length > 0) {
            return { effect: {}, description, grade, isChoice: true, choices, eventId: Number(eventId) };
        }
        if(branch)
            for(const [cond, next] of branch)
                if(this.#system.check(cond))
                    return { effect, next, description, grade };
        return { effect, postEvent, description, grade };
    }

}

export default Event;