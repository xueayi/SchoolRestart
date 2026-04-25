export default class Summary extends ui.view.DefaultTheme.SummaryUI {
    constructor() {
        super();
        this.listSummary.renderHandler = Laya.Handler.create(this, this.renderSummary, null, false);
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

        this.listSummary.array = [
            [core.PropertyTypes.HAPR, $lang.UI_Property_Appearance],
            [core.PropertyTypes.HKNW, $lang.UI_Property_Knowledge],
            [core.PropertyTypes.HSOC, $lang.UI_Property_Social],
            [core.PropertyTypes.HCHM, $lang.UI_Property_Charm],
            [core.PropertyTypes.HLOV, $lang.UI_Property_Love],
            [core.PropertyTypes.HSEM, $lang.UI_Final_Semester],
            [core.PropertyTypes.SUM, $lang.UI_Total_Judge],
        ].map(([type, key]) => {
            const data = summary[type];
            return {
                label: `${key}${$lang.UI_Colon} ${data.value} ${$lang[data.judge]}`,
                grade: data.grade,
            }
        });

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
                const parent = this.listSummary.parent;
                btnBox.y = this.listSummary.y + this.listSummary.height + 30;
                parent.addChild(btnBox);

                const btnBg = new Laya.Sprite();
                btnBg.graphics.drawRect(0, 0, btnBox.width, btnBox.height, '#e8a0bf');
                btnBox.addChild(btnBg);

                const btn = new Laya.Label();
                btn.text = '>> 查看你的恋爱故事 <<';
                btn.fontSize = 40;
                btn.color = '#1a0a1e';
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
        const overlay = new Laya.Sprite();
        overlay.graphics.drawRect(0, 0, Laya.stage.width, Laya.stage.height, '#1a0a1e');
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
        title.color = '#e8a0bf';
        title.align = 'center';
        title.width = content.width;
        title.y = 60;
        content.addChild(title);

        const body = new Laya.Label();
        body.text = this.#storyText;
        body.fontSize = 36;
        body.color = '#f0e6f6';
        body.wordWrap = true;
        body.width = content.width;
        body.leading = 16;
        body.y = 160;
        content.addChild(body);

        const backBtn = new Laya.Label();
        backBtn.text = '返回总结';
        backBtn.fontSize = 42;
        backBtn.color = '#1a0a1e';
        backBtn.bgColor = '#e8a0bf';
        backBtn.padding = '16,60,16,60';
        backBtn.align = 'center';
        backBtn.width = 300;
        backBtn.x = (content.width - 300) / 2;
        backBtn.y = body.y + body.textHeight + 60;
        backBtn.mouseEnabled = true;
        content.addChild(backBtn);

        content.height = backBtn.y + 140;
        panel.addChild(content);
        overlay.addChild(panel);

        backBtn.on(Laya.Event.CLICK, this, () => {
            overlay.destroy(true);
        });
    }

    renderSummary(box) {
        const {label, grade} = box.dataSource;
        box.label = label;
        $_.deepMapSet(box, $ui.common.summary[grade]);
    }
    renderTalent(box) {
        const dataSource = box.dataSource;
        box.label = $_.format($lang.F_TalentSelection, dataSource);
        const style = $ui.common.card[dataSource.grade];
        $_.deepMapSet(box, dataSource.id == this.#selectedTalent? style.selected: style.normal);
        box.getChildByName('blank').pause = dataSource.id != this.#selectedTalent;
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
