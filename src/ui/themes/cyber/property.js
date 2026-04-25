export default class CyberProperty extends ui.view.CyberTheme.CyberPropertyUI {
    constructor() {
        super();

        const types =
        this.#types = core.PropertyTypes;

        this.btnCharmIncrease.on(Laya.Event.CLICK, this, this.onPropertyAllocate, [types.APR, 1]);
        this.btnCharmReduce.on(Laya.Event.CLICK, this, this.onPropertyAllocate, [types.APR, -1]);

        this.btnIntelligenceIncrease.on(Laya.Event.CLICK, this, this.onPropertyAllocate, [types.KNW, 1]);
        this.btnIntelligenceReduce.on(Laya.Event.CLICK, this, this.onPropertyAllocate, [types.KNW, -1]);

        this.btnStrengthIncrease.on(Laya.Event.CLICK, this, this.onPropertyAllocate, [types.SOC, 1]);
        this.btnStrengthReduce.on(Laya.Event.CLICK, this, this.onPropertyAllocate, [types.SOC, -1]);

        this.btnMoneyIncrease.on(Laya.Event.CLICK, this, this.onPropertyAllocate, [types.CHM, 1]);
        this.btnMoneyReduce.on(Laya.Event.CLICK, this, this.onPropertyAllocate, [types.CHM, -1]);

        this.inputCharm.on(Laya.Event.INPUT, this, this.onPropertyAllocateInput, [types.APR]);
        this.inputIntelligence.on(Laya.Event.INPUT, this, this.onPropertyAllocateInput, [types.KNW]);
        this.inputStrength.on(Laya.Event.INPUT, this, this.onPropertyAllocateInput, [types.SOC]);
        this.inputMoney.on(Laya.Event.INPUT, this, this.onPropertyAllocateInput, [types.CHM]);

        const selectAll = ({currentTarget: item}) => { item.text=''; };
        this.inputCharm.on(Laya.Event.MOUSE_DOWN, this, selectAll);
        this.inputIntelligence.on(Laya.Event.MOUSE_DOWN, this, selectAll);
        this.inputStrength.on(Laya.Event.MOUSE_DOWN, this, selectAll);
        this.inputMoney.on(Laya.Event.MOUSE_DOWN, this, selectAll);

        this.btnRandomAllocate.on(Laya.Event.CLICK, this, this.showRandomOptions);
        this.btnNext.on(Laya.Event.CLICK, this, this.next);

        this.listSelectedTalents.renderHandler = Laya.Handler.create(this, this.renderTalent, null, false);
    }

    #types;
    #propertyPoints;
    #propertyAllocate;
    #propertyAllocateLimit;
    #presetOverlay;

    init({talents}) {
        this.listSelectedTalents.array = talents;
        const replace = core.remake(talents.map(talent => talent.id));
        if(replace.length > 0) {
            $$event('message', [replace.map(v => ['F_TalentReplace', v])]);
        }
        this.#propertyPoints = core.getPropertyPoints();
        this.#propertyAllocateLimit = core.propertyAllocateLimit;
        this.labLeftPropertyPoint.text = this.#propertyPoints;
        this.#propertyAllocate = {
            [this.#types.APR]: 0,
            [this.#types.KNW]: 0,
            [this.#types.SOC]: 0,
            [this.#types.CHM]: 0,
        }
        this.updateAllocate();
    }

    next() {
        const left = this.#propertyPoints - this.total;
        if (left > 0) {
            return $$event('message', ['F_PropertyPointLeft', left]);
        }
        $ui.switchView(
            UI.pages.TRAJECTORY,
            {
                propertyAllocate: this.#propertyAllocate,
                talents: this.listSelectedTalents.array,
                enableExtend: true,
            }
        );
    }

    get total() {
        return this.#propertyAllocate[this.#types.APR]
            +  this.#propertyAllocate[this.#types.KNW]
            +  this.#propertyAllocate[this.#types.SOC]
            +  this.#propertyAllocate[this.#types.CHM];
    }

    updateAllocate() {
        const charm = this.#propertyAllocate[this.#types.APR];
        const intelligence = this.#propertyAllocate[this.#types.KNW];
        const strength = this.#propertyAllocate[this.#types.SOC];
        const money = this.#propertyAllocate[this.#types.CHM];

        this.inputCharm.text = ''+charm;
        this.inputIntelligence.text = ''+intelligence;
        this.inputStrength.text = ''+strength;
        this.inputMoney.text = ''+money;

        this.labLeftPropertyPoint.text = this.#propertyPoints - this.total;

        this.btnCharmIncrease.disabled = this.btnCharmIncrease.gray = false;
        this.btnCharmReduce.disabled = this.btnCharmReduce.gray = false;
        this.btnIntelligenceIncrease.disabled = this.btnIntelligenceIncrease.gray = false;
        this.btnIntelligenceReduce.disabled = this.btnIntelligenceReduce.gray = false;
        this.btnStrengthIncrease.disabled = this.btnStrengthIncrease.gray = false;
        this.btnStrengthReduce.disabled = this.btnStrengthReduce.gray = false;
        this.btnMoneyIncrease.disabled = this.btnMoneyIncrease.gray = false;
        this.btnMoneyReduce.disabled = this.btnMoneyReduce.gray = false;

        if (this.total >= this.#propertyPoints) {
            this.btnCharmIncrease.disabled = this.btnCharmIncrease.gray = true;
            this.btnIntelligenceIncrease.disabled = this.btnIntelligenceIncrease.gray = true;
            this.btnStrengthIncrease.disabled = this.btnStrengthIncrease.gray = true;
            this.btnMoneyIncrease.disabled = this.btnMoneyIncrease.gray = true;
        } else if (this.total <= 0) {
            this.btnCharmReduce.disabled = this.btnCharmReduce.gray = true;
            this.btnIntelligenceReduce.disabled = this.btnIntelligenceReduce.gray = true;
            this.btnStrengthReduce.disabled = this.btnStrengthReduce.gray = true;
            this.btnMoneyReduce.disabled = this.btnMoneyReduce.gray = true;
        }

        if (charm <= this.#propertyAllocateLimit[0]) {
            this.btnCharmReduce.disabled = this.btnCharmReduce.gray = true;
        } else if (charm >= this.#propertyAllocateLimit[1]) {
            this.btnCharmIncrease.disabled = this.btnCharmIncrease.gray = true;
        }

        if (intelligence <= this.#propertyAllocateLimit[0]) {
            this.btnIntelligenceReduce.disabled = this.btnIntelligenceReduce.gray = true;
        } else if (intelligence >= this.#propertyAllocateLimit[1]) {
            this.btnIntelligenceIncrease.disabled = this.btnIntelligenceIncrease.gray = true;
        }

        if (strength <= this.#propertyAllocateLimit[0]) {
            this.btnStrengthReduce.disabled = this.btnStrengthReduce.gray = true;
        } else if (strength >= this.#propertyAllocateLimit[1]) {
            this.btnStrengthIncrease.disabled = this.btnStrengthIncrease.gray = true;
        }

        if (money <= this.#propertyAllocateLimit[0]) {
            this.btnMoneyReduce.disabled = this.btnMoneyReduce.gray = true;
        } else if (money >= this.#propertyAllocateLimit[1]) {
            this.btnMoneyIncrease.disabled = this.btnMoneyIncrease.gray = true;
        }
    }

    check(left, right, value) {
        if (value < left) return false;
        if (value > right) return false;
        return true;
    }

    static PRESETS = [
        { name: '[ 纯随机 ]', weights: null },
        { name: '[ 颜值型 ]', weights: [5, 1, 1, 2] },
        { name: '[ 学霸型 ]', weights: [1, 5, 1, 2] },
        { name: '[ 社交达人 ]', weights: [1, 1, 5, 2] },
        { name: '[ 万人迷 ]', weights: [2, 1, 1, 5] },
        { name: '[ 均衡型 ]', weights: [1, 1, 1, 1] },
    ];

    showRandomOptions() {
        if (this.#presetOverlay) {
            this.#presetOverlay.removeSelf();
            this.#presetOverlay.destroy();
            this.#presetOverlay = null;
            return;
        }

        const overlay = new Laya.Box();
        overlay.width = this.width;
        overlay.height = this.height;
        overlay.zOrder = 100;

        const bg = new Laya.Sprite();
        bg.graphics.drawRect(0, 0, overlay.width, overlay.height, 'rgba(0,0,0,0.6)');
        bg.mouseEnabled = true;
        bg.on(Laya.Event.CLICK, this, () => {
            overlay.removeSelf();
            overlay.destroy();
            this.#presetOverlay = null;
        });
        overlay.addChild(bg);

        const panel = new Laya.Box();
        panel.width = overlay.width * 0.85;
        panel.centerX = 0;
        panel.centerY = 0;
        overlay.addChild(panel);

        const title = new Laya.Label();
        title.text = '选择分配方案';
        title.fontSize = 42;
        title.color = '#5cc8dc';
        title.width = panel.width;
        title.align = 'center';
        title.y = 0;
        panel.addChild(title);

        let btnY = 70;
        CyberProperty.PRESETS.forEach((preset, i) => {
            const btn = new Laya.Box();
            btn.width = panel.width;
            btn.height = 80;
            btn.y = btnY;

            const btnBg = new Laya.Sprite();
            btnBg.graphics.drawRect(0, 0, btn.width, btn.height, '#0a1929');
            btnBg.graphics.drawRect(0, 0, btn.width, btn.height, null, '#5cc8dc', 2);
            btn.addChild(btnBg);

            const label = new Laya.Label();
            label.text = preset.name;
            label.fontSize = 36;
            label.color = '#c8ecf5';
            label.width = btn.width;
            label.height = btn.height;
            label.align = 'center';
            label.valign = 'middle';
            btn.addChild(label);

            btn.on(Laya.Event.CLICK, this, () => {
                this.applyPreset(preset.weights);
                overlay.removeSelf();
                overlay.destroy();
                this.#presetOverlay = null;
            });

            panel.addChild(btn);
            btnY += 100;
        });

        this.addChild(overlay);
        this.#presetOverlay = overlay;
    }

    applyPreset(weights) {
        const total = this.#propertyPoints;
        const max = this.#propertyAllocateLimit[1];

        if (!weights) {
            this.random();
            return;
        }

        const wSum = weights.reduce((a, b) => a + b, 0);
        const raw = weights.map(w => Math.round(total * w / wSum));
        let diff = total - raw.reduce((a, b) => a + b, 0);
        while (diff !== 0) {
            const idx = Math.floor(Math.random() * 4);
            const step = diff > 0 ? 1 : -1;
            if (raw[idx] + step >= 0 && raw[idx] + step <= max) {
                raw[idx] += step;
                diff -= step;
            }
        }
        const jitter = Math.max(1, Math.floor(total * 0.1));
        for (let i = 0; i < jitter; i++) {
            const a = Math.floor(Math.random() * 4);
            const b = Math.floor(Math.random() * 4);
            if (a === b) continue;
            const amount = Math.floor(Math.random() * 2) + 1;
            if (raw[a] - amount >= 0 && raw[b] + amount <= max) {
                raw[a] -= amount;
                raw[b] += amount;
            }
        }

        this.#propertyAllocate[this.#types.APR] = raw[0];
        this.#propertyAllocate[this.#types.KNW] = raw[1];
        this.#propertyAllocate[this.#types.SOC] = raw[2];
        this.#propertyAllocate[this.#types.CHM] = raw[3];
        this.updateAllocate();
    }

    random() {
        let t = this.#propertyPoints;
        const arr = new Array(4).fill(this.#propertyAllocateLimit[1]);

        while (t > 0) {
            const sub = Math.round(Math.random() * (Math.min(t, this.#propertyAllocateLimit[1]) - 1)) + 1;
            while(true) {
                const select = Math.floor(Math.random() * 4) % 4;
                if(arr[select] - sub <0) continue;
                arr[select] -= sub;
                t -= sub;
                break;
            }
        }
        this.#propertyAllocate[this.#types.APR] = this.#propertyAllocateLimit[1] - arr[0];
        this.#propertyAllocate[this.#types.KNW] = this.#propertyAllocateLimit[1] - arr[1];
        this.#propertyAllocate[this.#types.SOC] = this.#propertyAllocateLimit[1] - arr[2];
        this.#propertyAllocate[this.#types.CHM] = this.#propertyAllocateLimit[1] - arr[3];

        this.updateAllocate();
    }

    onPropertyAllocate(type, value) {
        if (!this.check(
                this.#propertyAllocateLimit[0],
                this.#propertyAllocateLimit[1],
                this.#propertyAllocate[type] + value
        )) {
            return;
        }
        if (!this.check(
            0,
            this.#propertyPoints,
            this.total + value
        )) {
            return;
        }
        this.#propertyAllocate[type] += value;
        this.updateAllocate();
    }

    onPropertyAllocateInput(type, inputItem) {
        let value = parseInt(inputItem.text) || 0;
        const total = this.total;
        if (total + value < 0) {
            value = this.#propertyAllocateLimit[0] * 4 - total;
        } else if (total + value > this.#propertyPoints) {
            value = this.#propertyPoints - total;
        }

        if (value < this.#propertyAllocateLimit[0]) {
            value = this.#propertyAllocateLimit[0];
        } else if (value > this.#propertyAllocateLimit[1]) {
            value = this.#propertyAllocateLimit[1];
        }


        const alter = value - this.#propertyAllocate[type];
        if (alter) {
            this.onPropertyAllocate(type, alter);
        } else {
            this.updateAllocate();
        }
    }

    renderTalent(box) {
        const dataSource = box.dataSource;

        const labTitle = box.getChildByName("labTitle");
        const grade1 = box.getChildByName("grade1");
        const grade2 = box.getChildByName("grade2");
        const grade3 = box.getChildByName("grade3");
        const labDescription = box.getChildByName("labDescription");

        labTitle.text = dataSource.name;
        labDescription.text = dataSource.description;
        switch (dataSource.grade) {
            case 1:
                grade1.visible = true;
                grade2.visible = false;
                grade3.visible = false;
                break;
            case 2:
                grade1.visible = false;
                grade2.visible = true;
                grade3.visible = false;
                break;
            case 3:
                grade1.visible = false;
                grade2.visible = false;
                grade3.visible = true;
                break;
            default:
                grade1.visible = false;
                grade2.visible = false;
                grade3.visible = false;
                break;
        }
    }
}