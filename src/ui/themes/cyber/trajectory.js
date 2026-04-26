export default class CyberTrajectory extends ui.view.CyberTheme.CyberTrajectoryUI {
    constructor() {
        super();
        let pos1 = [0, 0];
        this.panelTrajectory.on(Laya.Event.MOUSE_DOWN, this, e => pos1 = [e.stageX, e.stageY]);
        this.panelTrajectory.on(Laya.Event.MOUSE_UP, this, e => {
            const distanceX = e.stageX - pos1[0];
            const distanceY = e.stageY - pos1[1];
            if(Math.sqrt(Math.abs(distanceX) + Math.abs(distanceY)) > 10) {
                return;
            }
            this.onNext();
        });
        this.btnSummary.on(Laya.Event.CLICK, this, this.onSummary);

        this.panelTrajectory.vScrollBar.elasticDistance = 150;

        let interval = null;
        let timeout = null;

        const scroll = alter => {
            let value = this.panelTrajectory.vScrollBar.value + alter;
            if(value < 0) value = 0;
            if(value > this.panelTrajectory.vScrollBar.max) value = this.panelTrajectory.vScrollBar.max;
            this.panelTrajectory.scrollTo(0, value);
        }
        const on = (btn, alter) => {
            btn.off(Laya.Event.CLICK, this, scroll);
            btn.on(Laya.Event.CLICK, this, scroll, [100*alter]);
            timeout = setTimeout(() => {
                btn.off(Laya.Event.CLICK, this, scroll);
                interval = setInterval(() => scroll(10*alter), 10);
            }, 100);
        }
        const clear = () => {
            if(interval) {
                clearInterval(interval);
                interval = null;
            }
            if(timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
        };
        this.btnUp.on(Laya.Event.MOUSE_DOWN, this, on, [this.btnUp, -1]);
        this.btnDown.on(Laya.Event.MOUSE_DOWN, this, on, [this.btnDown, 1]);
        this.btnUp.on(Laya.Event.MOUSE_UP, this, clear);
        this.btnUp.on(Laya.Event.MOUSE_OUT, this, clear);
        this.btnDown.on(Laya.Event.MOUSE_UP, this, clear);
        this.btnDown.on(Laya.Event.MOUSE_OUT, this, clear);
        this.scbSpeed.on(Laya.Event.CHANGE, this, () => this.speed = this.scbSpeed.value);
        this.scbSpeed.on(Laya.Event.MOUSE_UP, this, () => this.onNext());
    }

    #speed;
    #auto;

    static #createComponent = Laya.plugin.extractComponents(CyberTrajectory.uiView, ['boxTrajectoryItem']);
    #createTrajectoryItem() {
        const item = CyberTrajectory.#createComponent('boxTrajectoryItem');
        item.labContent = item.getChildByName('labContent');
        item.labAge = item.getChildByName('hboxAge').getChildByName('labAge');
        item.boxGrade = item.getChildByName('boxGrade');
        return item;
    }
    #isEnd;
    #trajectoryItems;
    #talents;
    #enableExtend;
    #waitingChoice = false;

    static SEM_LABELS = [
        '',
        '出生', '一岁', '两岁',
        '幼儿园小班上', '幼儿园小班下', '幼儿园中班上', '幼儿园中班下', '幼儿园大班上', '幼儿园大班下',
        '小一·上', '小一·下', '小一·暑假', '小二·上', '小二·下', '小二·暑假',
        '小三·上', '小三·下', '小三·暑假', '小四·上', '小四·下', '小四·暑假',
        '小五·上', '小五·下', '小五·暑假', '小六·上', '小六·下', '小六·暑假',
        '初一·九月', '初一·十月', '初一·十一月', '初一·寒假', '初一·三月', '初一·暑假',
        '初二·九月', '初二·十月', '初二·十一月', '初二·寒假', '初二·三月', '初二·暑假',
        '初三·九月', '初三·十月', '初三·十一月', '初三·寒假', '初三·三月', '初三·中考',
        '高一·九月', '高一·十月', '高一·十一月', '高一·十二月', '高一·三月', '高一·四月', '高一·五月', '高一·六月',
        '高二·九月', '高二·十月', '高二·十一月', '高二·十二月', '高二·三月', '高二·四月', '高二·五月', '高二·六月',
        '高三·九月', '高三·十月', '高三·十一月', '高三·十二月', '高三·三月', '高三·四月', '高三·五月', '高三·高考',
        '大一·九月', '大一·十月', '大一·十一月', '大一·十二月', '大一·三月', '大一·四月', '大一·五月', '大一·六月',
        '大二·九月', '大二·十月', '大二·十一月', '大二·十二月', '大二·三月', '大二·四月', '大二·五月', '大二·六月',
        '大三·九月', '大三·十月', '大三·十一月', '大三·十二月', '大三·三月', '大三·四月', '大三·五月', '大三·六月',
        '大四·九月', '大四·十月', '大四·十一月', '大四·十二月', '大四·三月', '大四·四月', '大四·五月', '大四·毕业',
    ];

    init({propertyAllocate, talents, enableExtend}) {
        this.#enableExtend = enableExtend;
        this.boxParticle.visible = false;
        this.boxSpeed.visible = true;
        this.btnSummary.visible = false;
        this.#trajectoryItems = [];
        this.#isEnd = false;
        this.#talents = talents;
        core.start(propertyAllocate);
        this.updateProperty();
        this.onNext();
    }

    close() {
        this.scbSpeed.value = 0;
        this.speed = 0;
        this.#trajectoryItems.forEach(item => {
            item.removeSelf();
            item.destroy();
        });
        this.#trajectoryItems = null;
    }

    updateProperty() {
        const types = core.PropertyTypes;
        const propertys = core.propertys;

        this.labCharm.text = propertys[types.APR];
        this.labIntelligence.text = propertys[types.KNW];
        this.labStrength.text = propertys[types.SOC];
        this.labMoney.text = propertys[types.CHM];
        this.labSpirit.text = propertys[types.LOV];
    }

    onNext() {
        if(this.#isEnd || this.#waitingChoice) return;

        const { age, content, isEnd, isChoice, choiceItem } = core.next();
        this.#isEnd = isEnd;

        if(isEnd) {
            this.boxSpeed.visible = false;
            this.btnSummary.visible = true;
            Laya.timer.frameOnce(1,this,()=>{
                this.panelTrajectory.scrollTo(0, this.panelTrajectory.contentHeight);
            });
        }
        this.panelTrajectory.scrollTo(0, this.panelTrajectory.contentHeight);
        this.renderTrajectory(age, content);

        if(age >= 95) {
            this.boxParticle.visible = true;
        }
        this.updateProperty();

        if(isChoice && choiceItem && !isEnd) {
            this.showChoiceInline(choiceItem);
        }
    }

    showChoiceInline(choiceItem) {
        this.speed = 0;
        this.#waitingChoice = true;

        const qItem = this.#createTrajectoryItem();
        qItem.labAge.text = '❓';
        qItem.labContent.text = choiceItem.description;
        $_.deepMapSet(qItem.boxGrade, $ui.common.gradeBlk[1]);
        this.vboxTrajectory.addChild(qItem);
        this.#trajectoryItems.push(qItem);
        qItem.y = this.vboxTrajectory.height;

        const containerWidth = qItem.width || this.vboxTrajectory.width || this.width * 0.9;

        choiceItem.choices.forEach((choice, index) => {
            const btn = new Laya.Box();
            btn.width = containerWidth;
            btn.height = 90;

            const btnBg = new Laya.Sprite();
            btnBg.graphics.drawRect(8, 0, btn.width - 16, btn.height, '#2d1f3d');
            btnBg.graphics.drawRect(8, 0, btn.width - 16, btn.height, null, '#e8a0bf', 2);
            btn.addChild(btnBg);

            const label = new Laya.Label();
            label.text = core.format(choice.text);
            label.fontSize = 34;
            label.color = '#f0e6f6';
            label.width = btn.width - 32;
            label.height = btn.height;
            label.x = 16;
            label.align = 'center';
            label.valign = 'middle';
            btn.addChild(label);

            btn.on(Laya.Event.CLICK, this, () => {
                this.#waitingChoice = false;
                const result = core.resolveChoice(choiceItem.eventId, index);

                const resItem = this.#createTrajectoryItem();
                resItem.labAge.text = '→';
                const resTexts = [`选择了「${core.format(choice.text)}」`];
                if (result.length > 0) {
                    resTexts.push(...result.map(r => r.description || '').filter(Boolean));
                }
                resItem.labContent.text = resTexts.join('\n');
                $_.deepMapSet(
                    resItem.boxGrade,
                    $ui.common.gradeBlk[result.length > 0 ? (result[result.length - 1]?.grade || 0) : 0]
                );
                this.vboxTrajectory.addChild(resItem);
                this.#trajectoryItems.push(resItem);
                resItem.y = this.vboxTrajectory.height;

                this.updateProperty();
                Laya.timer.frameOnce(1, this, () => {
                    this.panelTrajectory.scrollTo(0, this.panelTrajectory.contentHeight);
                });
            });

            this.vboxTrajectory.addChild(btn);
            this.#trajectoryItems.push(btn);
            btn.y = this.vboxTrajectory.height;
        });

        Laya.timer.frameOnce(1, this, () => {
            this.panelTrajectory.scrollTo(0, this.panelTrajectory.contentHeight);
        });
    }

    renderTrajectory(age, content) {
        const item = this.#createTrajectoryItem();
        const label = CyberTrajectory.SEM_LABELS[age] || `第${age}学期`;
        item.labAge.text = label;
        item.labAge.fontSize = label.length > 5 ? 28 : label.length > 4 ? 34 : label.length > 3 ? 40 : 50;
        item.labContent.text = content.map(
            ({type, description, grade, name, postEvent}) => {
                switch(type) {
                    case 'TLT':
                        return `天赋【${name}】发动：${description}`;
                    case 'EVT':
                        return description + (postEvent?`\n${postEvent}`:'');
                }
            }
        ).join('\n');
        $_.deepMapSet(
            item.boxGrade,
            $ui.common.gradeBlk[content[content.length - 1]?.grade || 0]
        );
        this.vboxTrajectory.addChild(item);
        this.#trajectoryItems.push(item);
        item.y = this.vboxTrajectory.height;
    }

    onSummary() {
        const talents = this.#talents;
        $ui.switchView(UI.pages.SUMMARY, { talents, enableExtend: this.#enableExtend });
    }

    get speed() {
        return this.#speed;
    }

    set speed(speed) {
        this.#speed = speed;
        this.prgSpeed.value = speed / this.scbSpeed.max;
        clearInterval(this.#auto);
        this.#auto = null;
        if(!speed) return;
        this.#auto = setInterval(
            () => this.onNext(),
            3000 * (1 - this.prgSpeed.value) + 300
        );
    }
}