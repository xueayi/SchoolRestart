class Property {
    constructor(system) {
        this.#system = system;
    }

    TYPES = {
        SEM: "SEM", // 学期 semester
        APR: "APR", // 颜值 appearance
        KNW: "KNW", // 学识 knowledge
        SOC: "SOC", // 社交 social
        CHM: "CHM", // 魅力 charm
        LOV: "LOV", // 心动值 love
        VIT: "VIT", // 元气 vitality
        TLT: "TLT", // 天赋 talent
        EVT: "EVT", // 事件 event
        TMS: "TMS", // 次数 times
        GND: "GND", // 性别 gender

        // Auto calc - Low
        LSEM: "LSEM",
        LAPR: "LAPR",
        LKNW: "LKNW",
        LSOC: "LSOC",
        LCHM: "LCHM",
        LLOV: "LLOV",

        // Auto calc - High
        HSEM: "HSEM",
        HAPR: "HAPR",
        HKNW: "HKNW",
        HSOC: "HSOC",
        HCHM: "HCHM",
        HLOV: "HLOV",

        SUM: "SUM", // 总评 summary

        EXT: "EXT", // 继承天赋

        // Achievement Total
        ATLT: "ATLT",
        AEVT: "AEVT",
        ACHV: "ACHV",

        CTLT: "CTLT",
        CEVT: "CEVT",
        CACHV: "CACHV",

        TTLT: "TTLT",
        TEVT: "TEVT",
        TACHV: "TACHV",

        RTLT: "RTLT",
        REVT: "REVT",
        RACHV: "RACHV",

        RDM: 'RDM',
    };

    SPECIAL = {
        RDM: [
            this.TYPES.APR,
            this.TYPES.KNW,
            this.TYPES.SOC,
            this.TYPES.CHM,
            this.TYPES.LOV,
        ]
    }

    #system;
    #semData;
    #data = {};
    #total;
    #judge;
    #maxSem = 101;

    get #util() {
        return this.#system.function(this.#system.Function.UTIL);
    }

    initial({age, total}) {
        this.#semData = age;
        const semNums = Object.keys(age).map(Number).filter((n) => !Number.isNaN(n));
        this.#maxSem = semNums.length ? Math.max(...semNums) : 101;

        for(const a in age) {
            let { event, talent, guaranteed } = age[a];
            if(!Array.isArray(event))
                event = event?.split(',') || [];

            event = event.filter((v) => v !== '' && v != null && `${v}`.trim() !== '');
            event = event.map(v=>{
                const value = `${v}`.split('*').map(n=>Number(n));
                if(value.length==1) value.push(1);
                return value;
            });

            if (!Array.isArray(guaranteed)) guaranteed = guaranteed?.split(',') || [];
            guaranteed = guaranteed
                .filter((v) => v !== '' && v != null && `${v}`.trim() !== '')
                .map((v) => Number(`${v}`.split('*')[0]))
                .filter((id) => !Number.isNaN(id) && id !== 0);

            if(!Array.isArray(talent))
                talent = talent?.split(',') || [];

            talent = talent.map(v=>Number(v));

            age[a] = { event, talent, guaranteed };
        }
        this.#total = total;
    }

    config({judge = {}}) {
        this.#judge = judge;
    }

    restart(data) {
        this.#data = {
            [this.TYPES.SEM]: 0,

            [this.TYPES.APR]: 0,
            [this.TYPES.KNW]: 0,
            [this.TYPES.SOC]: 0,
            [this.TYPES.CHM]: 0,
            [this.TYPES.LOV]: 0,

            [this.TYPES.VIT]: 1,

            [this.TYPES.TLT]: [],
            [this.TYPES.EVT]: [],

            [this.TYPES.LSEM]: Infinity,
            [this.TYPES.LAPR]: Infinity,
            [this.TYPES.LKNW]: Infinity,
            [this.TYPES.LSOC]: Infinity,
            [this.TYPES.LLOV]: Infinity,
            [this.TYPES.LCHM]: Infinity,

            [this.TYPES.HSEM]: -Infinity,
            [this.TYPES.HAPR]: -Infinity,
            [this.TYPES.HKNW]: -Infinity,
            [this.TYPES.HSOC]: -Infinity,
            [this.TYPES.HLOV]: -Infinity,
            [this.TYPES.HCHM]: -Infinity,
        };
        for(const key in data)
            this.change(key, data[key]);
    }

    restartLastStep() {
        this.#data[this.TYPES.LSEM] = this.get(this.TYPES.SEM);
        this.#data[this.TYPES.LAPR] = this.get(this.TYPES.APR);
        this.#data[this.TYPES.LKNW] = this.get(this.TYPES.KNW);
        this.#data[this.TYPES.LSOC] = this.get(this.TYPES.SOC);
        this.#data[this.TYPES.LLOV] = this.get(this.TYPES.LOV);
        this.#data[this.TYPES.LCHM] = this.get(this.TYPES.CHM);
        this.#data[this.TYPES.HSEM] = this.get(this.TYPES.SEM);
        this.#data[this.TYPES.HAPR] = this.get(this.TYPES.APR);
        this.#data[this.TYPES.HKNW] = this.get(this.TYPES.KNW);
        this.#data[this.TYPES.HSOC] = this.get(this.TYPES.SOC);
        this.#data[this.TYPES.HCHM] = this.get(this.TYPES.CHM);
        this.#data[this.TYPES.HLOV] = this.get(this.TYPES.LOV);
    }

    get(prop) {
        const util = this.#util;
        switch(prop) {
            case this.TYPES.SEM:
            case this.TYPES.APR:
            case this.TYPES.KNW:
            case this.TYPES.SOC:
            case this.TYPES.CHM:
            case this.TYPES.LOV:
            case this.TYPES.VIT:
            case this.TYPES.TLT:
            case this.TYPES.EVT:
            case this.TYPES.GND:
                return util.clone(this.#data[prop]);
            case this.TYPES.LSEM:
            case this.TYPES.LAPR:
            case this.TYPES.LKNW:
            case this.TYPES.LSOC:
            case this.TYPES.LCHM:
            case this.TYPES.LLOV:
                return util.min(
                    this.#data[prop],
                    this.get(this.fallback(prop))
                );
            case this.TYPES.HSEM:
            case this.TYPES.HAPR:
            case this.TYPES.HKNW:
            case this.TYPES.HSOC:
            case this.TYPES.HCHM:
            case this.TYPES.HLOV:
                return util.max(
                    this.#data[prop],
                    this.get(this.fallback(prop))
                );
            case this.TYPES.SUM:
                const HSEM = this.get(this.TYPES.HSEM);
                const HAPR = this.get(this.TYPES.HAPR);
                const HKNW = this.get(this.TYPES.HKNW);
                const HSOC = this.get(this.TYPES.HSOC);
                const HCHM = this.get(this.TYPES.HCHM);
                const HLOV = this.get(this.TYPES.HLOV);
                // LOV has highest weight for romance theme
                return Math.floor(util.sum(HAPR, HKNW, HSOC, HCHM) + HLOV * 3 + HSEM);
            case this.TYPES.TMS:
                return this.lsget('times') || 0;
            case this.TYPES.EXT:
                return this.lsget('extendTalent') || null;
            case this.TYPES.ATLT:
            case this.TYPES.AEVT:
            case this.TYPES.ACHV:
                return this.lsget(prop) || [];
            case this.TYPES.CTLT:
            case this.TYPES.CEVT:
            case this.TYPES.CACHV:
                return this.get(
                    this.fallback(prop)
                ).length;
            case this.TYPES.TTLT:
            case this.TYPES.TEVT:
            case this.TYPES.TACHV:
                return this.#total[prop];
            case this.TYPES.RTLT:
            case this.TYPES.REVT:
            case this.TYPES.RACHV:
                const fb = this.fallback(prop);
                return this.get(fb[0]) / this.get(fb[1]);
            default: return 0;
        }
    }

    fallback(prop) {
        switch(prop) {
            case this.TYPES.LSEM:
            case this.TYPES.HSEM: return this.TYPES.SEM;
            case this.TYPES.LAPR:
            case this.TYPES.HAPR: return this.TYPES.APR;
            case this.TYPES.LKNW:
            case this.TYPES.HKNW: return this.TYPES.KNW;
            case this.TYPES.LSOC:
            case this.TYPES.HSOC: return this.TYPES.SOC;
            case this.TYPES.LCHM:
            case this.TYPES.HCHM: return this.TYPES.CHM;
            case this.TYPES.LLOV:
            case this.TYPES.HLOV: return this.TYPES.LOV;
            case this.TYPES.CTLT: return this.TYPES.ATLT;
            case this.TYPES.CEVT: return this.TYPES.AEVT;
            case this.TYPES.CACHV: return this.TYPES.ACHV;
            case this.TYPES.VIT: return this.TYPES.VIT;
            case this.TYPES.RTLT: return [this.TYPES.CTLT, this.TYPES.TTLT];
            case this.TYPES.REVT: return [this.TYPES.CEVT, this.TYPES.TEVT];
            case this.TYPES.RACHV: return [this.TYPES.CACHV, this.TYPES.TACHV];
            default: return;
        }
    }

    set(prop, value) {
        switch(prop) {
            case this.TYPES.SEM:
            case this.TYPES.APR:
            case this.TYPES.KNW:
            case this.TYPES.SOC:
            case this.TYPES.CHM:
            case this.TYPES.LOV:
            case this.TYPES.VIT:
            case this.TYPES.TLT:
            case this.TYPES.EVT:
                this.hl(prop, this.#data[prop] = this.#system.clone(value));
                this.achieve(prop, value);
                return;
            case this.TYPES.GND:
                this.#data[prop] = value;
                return;
            case this.TYPES.TMS:
                this.lsset('times', parseInt(value) || 0);
                return;
            case this.TYPES.EXT:
                this.lsset('extendTalent', value);
                return
            default: return;
        }
    }

    getPropertys() {
        return this.#system.clone({
            [this.TYPES.SEM]: this.get(this.TYPES.SEM),
            [this.TYPES.APR]: this.get(this.TYPES.APR),
            [this.TYPES.KNW]: this.get(this.TYPES.KNW),
            [this.TYPES.SOC]: this.get(this.TYPES.SOC),
            [this.TYPES.CHM]: this.get(this.TYPES.CHM),
            [this.TYPES.LOV]: this.get(this.TYPES.LOV),
        });
    }

    change(prop, value) {
        if(Array.isArray(value)) {
            for(const v of value)
                this.change(prop, Number(v));
            return;
        }
        switch(prop) {
            case this.TYPES.SEM:
            case this.TYPES.APR:
            case this.TYPES.KNW:
            case this.TYPES.SOC:
            case this.TYPES.CHM:
            case this.TYPES.LOV:
            case this.TYPES.VIT:
                this.hl(prop, this.#data[prop] += Number(value));
                return;
            case this.TYPES.TLT:
            case this.TYPES.EVT:
                const v = this.#data[prop];
                if(value<0) {
                    const index = v.indexOf(value);
                    if(index!=-1) v.splice(index,1);
                }
                if(!v.includes(value)) v.push(value);
                this.achieve(prop, value);
                return;
            case this.TYPES.TMS:
                this.set(
                    prop,
                    this.get(prop) + parseInt(value)
                );
                return;
            default: return;
        }
    }

    hookSpecial(prop) {
        switch(prop) {
            case this.TYPES.RDM:
                return this.#util.listRandom(this.SPECIAL.RDM);
            default: return prop;
        }
    }

    effect(effects) {
        for(let prop in effects)
            this.change(
                this.hookSpecial(prop),
                Number(effects[prop])
            );
    }

    judge(prop) {
        const value = this.get(prop);

        const d = this.#judge[prop];
        let length = d.length;

        const progress = () => Math.max(Math.min(value, 50), 0) / 50;

        while(length--) {
            const [min, grade, judge] = d[length];
            if(!length || min==void 0 || value >= min) return {prop, value, judge, grade, progress: progress()};
        }
    }

    isEnd() {
        return this.get(this.TYPES.SEM) >= this.#maxSem;
    }

    ageNext() {
        this.change(this.TYPES.SEM, 1);
        const age = this.get(this.TYPES.SEM);
        const {event, talent, guaranteed} = this.getSemData(age);
        return {age, event, talent, guaranteed};
    }

    getSemData(sem) {
        const data = this.#semData[sem];
        if (!data) return { event: [], talent: [], guaranteed: [] };
        return this.#system.clone(data);
    }

    hl(prop, value) {
        let keys;
        switch(prop) {
            case this.TYPES.SEM: keys = [this.TYPES.LSEM, this.TYPES.HSEM]; break;
            case this.TYPES.APR: keys = [this.TYPES.LAPR, this.TYPES.HAPR]; break;
            case this.TYPES.KNW: keys = [this.TYPES.LKNW, this.TYPES.HKNW]; break;
            case this.TYPES.SOC: keys = [this.TYPES.LSOC, this.TYPES.HSOC]; break;
            case this.TYPES.CHM: keys = [this.TYPES.LCHM, this.TYPES.HCHM]; break;
            case this.TYPES.LOV: keys = [this.TYPES.LLOV, this.TYPES.HLOV]; break;
            default: return;
        }
        const [l, h] = keys;
        this.#data[l] = this.#util.min(this.#data[l], value);
        this.#data[h] = this.#util.max(this.#data[h], value);
    }

    achieve(prop, newData) {
        let key;
        switch(prop) {
            case this.TYPES.ACHV:
                const lastData = this.lsget(prop);
                this.lsset(
                    prop,
                    (lastData || []).concat([[newData, Date.now()]])
                );
                return;
            case this.TYPES.TLT: key = this.TYPES.ATLT; break;
            case this.TYPES.EVT: key = this.TYPES.AEVT; break;
            default: return;
        }
        const lastData = this.lsget(key) || [];
        this.lsset(
            key,
            Array.from(
                new Set(
                    lastData
                        .concat(newData||[])
                        .flat()
                )
            )
        )
    }

    lsget(key) {
        const data = localStorage.getItem(key);
        if(data === null || data === 'undefined') return;
        return JSON.parse(data);
    }

    lsset(key, value) {
        localStorage.setItem(
            key,
            JSON.stringify(value)
        );
    }
}

export default Property;
