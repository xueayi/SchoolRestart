export default class Trajectory extends ui.view.DefaultTheme.TrajectoryUI {
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
        this.scbSpeed.on(Laya.Event.CHANGE, this, () => this.speed = this.scbSpeed.value);
        this.scbSpeed.on(Laya.Event.MOUSE_UP, this, () => this.onNext());
    }

    #speed;
    #auto;

    static load() {
        return [
            "images/atlas/images/progress.atlas",
            'images/atlas/images/slider.atlas',
        ];
    }

    static #createComponent = Laya.plugin.extractComponents(Trajectory.uiView, ['boxTrajectoryItem']);
    #createTrajectoryItem() {
        const item = Trajectory.#createComponent('boxTrajectoryItem');
        item.labContent = item.getChildByName('labContent');
        item.labAge = item.getChildByName('hboxAge').getChildByName('labAge');
        const config = $ui.common.trajectoryItem;
        $_.deepMapSet(item, config.box);
        item.grade = grade => {
            $_.deepMapSet(item, config.grade[grade || 0]);
        }
        item.getChildByName('hboxAge')._childs.forEach(child => child.color = config.ageColor);
        item.labContent.color = config.contentColor;
        return item;
    }
    #isEnd;
    #trajectoryItems;
    #talents;
    #enableExtend;

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
        if(this.#isEnd) return;

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

        this.updateProperty();

        if(isChoice && choiceItem && !isEnd) {
            this.showChoice(choiceItem);
        }
    }

    showChoice(choiceItem) {
        this.speed = 0;

        const overlay = new Laya.Box();
        overlay.width = this.width;
        overlay.height = this.height;
        overlay.zOrder = 100;

        const bg = new Laya.Sprite();
        bg.graphics.drawRect(0, 0, overlay.width, overlay.height, 'rgba(0,0,0,0.7)');
        overlay.addChild(bg);

        const panel = new Laya.Box();
        panel.width = overlay.width * 0.85;
        panel.centerX = 0;
        panel.centerY = 0;
        overlay.addChild(panel);

        const question = new Laya.Label();
        question.text = choiceItem.description;
        question.fontSize = 40;
        question.color = '#ffffff';
        question.wordWrap = true;
        question.width = panel.width;
        question.align = 'center';
        question.y = 0;
        panel.addChild(question);

        let btnY = question.height + 60;

        choiceItem.choices.forEach((choice, index) => {
            const btn = new Laya.Box();
            btn.width = panel.width;
            btn.height = 100;
            btn.y = btnY;

            const btnBg = new Laya.Sprite();
            btnBg.graphics.drawRect(0, 0, btn.width, btn.height, '#2d1f3d');
            btnBg.graphics.drawRect(0, 0, btn.width, btn.height, null, '#e8a0bf', 2);
            btn.addChild(btnBg);

            const label = new Laya.Label();
            label.text = core.format(choice.text);
            label.fontSize = 36;
            label.color = '#f0e6f6';
            label.width = btn.width;
            label.height = btn.height;
            label.align = 'center';
            label.valign = 'middle';
            btn.addChild(label);

            btn.on(Laya.Event.CLICK, this, () => {
                const result = core.resolveChoice(choiceItem.eventId, index);
                overlay.removeSelf();
                overlay.destroy();

                if (result.length > 0) {
                    const item = this.#createTrajectoryItem();
                    item.labAge.text = '→';
                    item.labContent.text = `选择了「${core.format(choice.text)}」\n` + result.map(r => r.description || '').filter(Boolean).join('\n');
                    item.grade(result[result.length - 1]?.grade || 0);
                    this.vboxTrajectory.addChild(item);
                    this.#trajectoryItems.push(item);
                    item.y = this.vboxTrajectory.height;
                }
                this.updateProperty();
                this.panelTrajectory.scrollTo(0, this.panelTrajectory.contentHeight);
            });

            panel.addChild(btn);
            btnY += 120;
        });

        this.addChild(overlay);
    }

    renderTrajectory(sem, content) {
        const item = this.#createTrajectoryItem();
        const label = Trajectory.SEM_LABELS[sem] || `第${sem}学期`;
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
        item.grade(content[content.length - 1]?.grade);
        this.vboxTrajectory.addChild(item);
        this.#trajectoryItems.push(item);
        item.y = this.vboxTrajectory.height;
    }

    onSummary() {
        const talents = this.#talents;
        $ui.switchView(UI.pages.SUMMARY, {talents, enableExtend: this.#enableExtend});
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
