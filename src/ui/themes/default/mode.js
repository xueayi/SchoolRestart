export default class Mode extends ui.view.DefaultTheme.ModeUI {
    constructor() {
        super();
        this.btnCustom.on(Laya.Event.CLICK, this, ()=>{
            core.setGender(this.#gender);
            $ui.switchView(UI.pages.TALENT);
        });
        this.btnCelebrity.on(Laya.Event.CLICK, this, ()=>{
            core.setGender(this.#gender);
            $ui.switchView(UI.pages.CELEBRITY);
        });
    }

    #gender = 'M';

    init() {
        this.#gender = 'M';
    }
}
