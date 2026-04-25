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
                const btn = new Laya.Label();
                btn.text = '💕 查看你的恋爱故事 💕';
                btn.fontSize = 38;
                btn.color = '#e8a0bf';
                btn.align = 'center';
                btn.width = this.width - 80;
                btn.centerX = 0;
                btn.mouseEnabled = true;
                const parent = this.listSummary.parent;
                btn.y = this.listSummary.y + this.listSummary.height + 30;
                parent.addChild(btn);
                btn.on(Laya.Event.CLICK, this, this.#showStoryPage);
                this.#storyBtn = btn;
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

        const closeBtn = new Laya.Label();
        closeBtn.text = '关 闭';
        closeBtn.fontSize = 42;
        closeBtn.color = '#fff';
        closeBtn.bgColor = '#e8a0bf';
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
