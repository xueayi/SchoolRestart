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
                const btnBox = new Laya.Box();
                btnBox.width = this.width - 80;
                btnBox.height = 80;
                btnBox.centerX = 0;
                const summaryPanel = this.getChildByName('summary');
                btnBox.y = summaryPanel.y + summaryPanel.height + 30;
                this.addChild(btnBox);

                const btnBg = new Laya.Sprite();
                btnBg.graphics.drawRect(0, 0, btnBox.width, btnBox.height, '#5cc8dc');
                btnBox.addChild(btnBg);

                const btn = new Laya.Label();
                btn.text = '>> 查看你的恋爱故事 <<';
                btn.fontSize = 40;
                btn.color = '#0a1929';
                btn.bold = true;
                btn.align = 'center';
                btn.valign = 'middle';
                btn.width = btnBox.width;
                btn.height = btnBox.height;
                btnBox.addChild(btn);

                btnBox.on(Laya.Event.CLICK, this, this.#showStoryPage);
                Laya.Tween.to(btnBg, { alpha: 0.6 }, 600, null, Laya.Handler.create(this, () => {
                    Laya.Tween.to(btnBg, { alpha: 1 }, 600, null, null, 0, true);
                }));
                this.#storyBtn = btnBox;
            }
        }
    }

    #showStoryPage() {
        const W = Laya.stage.width;
        const H = Laya.stage.height;
        const BTN_H = 100;

        const overlay = new Laya.Sprite();
        overlay.graphics.drawRect(0, 0, W, H, '#0a1929');
        overlay.width = W;
        overlay.height = H;
        overlay.zOrder = 9999;
        Laya.stage.addChild(overlay);

        const backBtn = new Laya.Label();
        backBtn.text = '返回总结';
        backBtn.fontSize = 42;
        backBtn.color = '#0a1929';
        backBtn.bgColor = '#5cc8dc';
        backBtn.padding = '16,60,16,60';
        backBtn.align = 'center';
        backBtn.width = 300;
        backBtn.x = (W - 300) / 2;
        backBtn.y = H - BTN_H - 20;
        backBtn.mouseEnabled = true;
        overlay.addChild(backBtn);

        const panel = new Laya.Panel();
        panel.width = W;
        panel.height = H - BTN_H - 40;
        panel.vScrollBarSkin = '';
        panel.vScrollBar.elasticDistance = 100;

        const content = new Laya.Box();
        content.width = W - 80;
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

        Laya.timer.frameOnce(2, this, () => {
            content.height = body.y + body.textHeight + 80;
        });
        content.height = 2000;

        panel.addChild(content);
        overlay.addChild(panel);

        backBtn.on(Laya.Event.CLICK, this, () => {
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