export default class CyberSummary extends ui.view.CyberTheme.CyberSummaryUI {
    constructor() {
        super();
        this.listSelectedTalents.renderHandler = Laya.Handler.create(this, this.renderTalent, null, false);
        this.btnAgain.on(Laya.Event.CLICK, this, this.onAgain);
    }

    #selectedTalent;
    #enableExtend;
    #storyText;
    #storyBtn;

    onAgain() {
        core.talentExtend(this.#selectedTalent);
        core.times ++;
        $ui.switchView(UI.pages.MAIN);
    }

    init({talents, enableExtend}) {
        const {summary, lastExtendTalent} = core;
        this.#enableExtend = enableExtend;

        const gradeFilters = $ui.common.filter;
        const gradeColors = $ui.common.grade;

        const sem = summary[core.PropertyTypes.HSEM];
        this.labAge.text = ''+sem.value;
        this.labAgeJudge.text = sem.judge;
        this.labAgeJudge.color = gradeColors[sem.grade];

        const sum = summary[core.PropertyTypes.SUM];
        this.labTotal.text = ''+sum.value;
        this.labTotalJudge.text = sum.judge;
        this.labTotalJudge.color = gradeColors[sum.grade];

        const apr = summary[core.PropertyTypes.HAPR];
        this.labCharm.text = ''+apr.value;
        this.prgCharm.value = apr.progress;
        this.labCharmJudge.text = apr.judge;
        this.labCharmJudge.color = gradeColors[apr.grade];
        this.boxCharmGrade.colorFilter = gradeFilters[apr.grade];

        const knw = summary[core.PropertyTypes.HKNW];
        this.labIntelligence.text = ''+knw.value;
        this.prgIntelligence.value = knw.progress;
        this.labIntelligenceJudge.text = knw.judge;
        this.labIntelligenceJudge.color = gradeColors[knw.grade];
        this.boxIntelligenceGrade.colorFilter = gradeFilters[knw.grade];

        const soc = summary[core.PropertyTypes.HSOC];
        this.labStrength.text = ''+soc.value;
        this.prgStrength.value = soc.progress;
        this.labStrengthJudge.text = soc.judge;
        this.labStrengthJudge.color = gradeColors[soc.grade];
        this.boxStrengthGrade.colorFilter = gradeFilters[soc.grade];

        const chm = summary[core.PropertyTypes.HCHM];
        this.labMoney.text = ''+chm.value;
        this.prgMoney.value = chm.progress;
        this.labMoneyJudge.text = chm.judge;
        this.labMoneyJudge.color = gradeColors[chm.grade];
        this.boxMoneyGrade.colorFilter = gradeFilters[chm.grade];

        const lov = summary[core.PropertyTypes.HLOV];
        this.labSpirit.text = ''+lov.value;
        this.prgSpirit.value = lov.progress;
        this.labSpiritJudge.text = lov.judge;
        this.labSpiritJudge.color = gradeColors[lov.grade];
        this.boxSpiritGrade.colorFilter = gradeFilters[lov.grade];

        talents.sort(({id:a, grade:ag}, {id:b, grade:bg},)=>{
            if(a == lastExtendTalent) return -1;
            if(b == lastExtendTalent) return 1;
            return bg - ag;
        });
        if(this.#enableExtend) {
            this.#selectedTalent = talents[0].id;
        } else {
            this.#selectedTalent = lastExtendTalent;
        }
        this.listSelectedTalents.array = talents;

        const storyKey = core.storyKey;
        this.#storyText = $lang[storyKey] ? core.format($lang[storyKey]) : '';
        if (this.#storyText) {
            if (!this.#storyBtn) {
                const btn = new Laya.Label();
                btn.text = '💕 查看你的恋爱故事 💕';
                btn.fontSize = 38;
                btn.color = '#5cc8dc';
                btn.align = 'center';
                btn.width = this.width - 80;
                btn.centerX = 0;
                btn.mouseEnabled = true;
                const summaryPanel = this.getChildByName('summary');
                btn.y = summaryPanel.y + summaryPanel.height + 30;
                this.addChild(btn);
                btn.on(Laya.Event.CLICK, this, this.#showStoryPage);
                this.#storyBtn = btn;
            }
        }
    }

    #showStoryPage() {
        const overlay = new Laya.Sprite();
        overlay.graphics.drawRect(0, 0, Laya.stage.width, Laya.stage.height, '#0a1929');
        overlay.width = Laya.stage.width;
        overlay.height = Laya.stage.height;
        overlay.zOrder = 9999;
        Laya.stage.addChild(overlay);

        const panel = new Laya.Panel();
        panel.width = overlay.width;
        panel.height = overlay.height;
        panel.vScrollBarSkin = '';
        panel.vScrollBar.elasticDistance = 100;

        const content = new Laya.Box();
        content.width = overlay.width - 80;
        content.x = 40;

        const title = new Laya.Label();
        title.text = '你的恋爱故事';
        title.fontSize = 56;
        title.color = '#5cc8dc';
        title.align = 'center';
        title.width = content.width;
        title.y = 60;
        content.addChild(title);

        const body = new Laya.Label();
        body.text = this.#storyText;
        body.fontSize = 36;
        body.color = '#c8ecf5';
        body.wordWrap = true;
        body.width = content.width;
        body.leading = 16;
        body.y = 160;
        content.addChild(body);

        const closeBtn = new Laya.Label();
        closeBtn.text = '关 闭';
        closeBtn.fontSize = 42;
        closeBtn.color = '#0a1929';
        closeBtn.bgColor = '#5cc8dc';
        closeBtn.padding = '16,60,16,60';
        closeBtn.align = 'center';
        closeBtn.width = 260;
        closeBtn.x = (content.width - 260) / 2;
        closeBtn.y = body.y + body.textHeight + 60;
        closeBtn.mouseEnabled = true;
        content.addChild(closeBtn);

        content.height = closeBtn.y + 140;
        panel.addChild(content);
        overlay.addChild(panel);

        closeBtn.on(Laya.Event.CLICK, this, () => {
            overlay.destroy(true);
        });
    }

    renderTalent(box) {
        const dataSource = box.dataSource;

        const labTitle = box.getChildByName("labTitle");
        const grade1 = box.getChildByName("grade1");
        const grade2 = box.getChildByName("grade2");
        const grade3 = box.getChildByName("grade3");
        const labDescription = box.getChildByName("labDescription");
        const selected = box.getChildByName("selected");
        const unselected = box.getChildByName("unselected");

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

        selected.visible = dataSource.id == this.#selectedTalent;
        unselected.visible = !selected.visible;
        box.off(Laya.Event.CLICK, this, this.onSelectTalent);
        box.on(Laya.Event.CLICK, this, this.onSelectTalent, [dataSource.id]);
    }

    onSelectTalent(talentId) {
        if(!this.#enableExtend) {
            return $$event('message', ['M_DisableExtendTalent']);
        }
        if(talentId == this.#selectedTalent) {
            this.#selectedTalent = null;
        } else {
            this.#selectedTalent = talentId;
        }

        this.listSelectedTalents.refresh();
    }
}