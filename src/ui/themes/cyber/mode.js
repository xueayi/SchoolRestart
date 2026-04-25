export default class CyberMode extends ui.view.CyberTheme.ModeUI {
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
    #btnMale;
    #btnFemale;

    init() {
        this.#gender = 'M';

        if (!this.#btnMale) {
            const box = new Laya.Box();
            box.width = 500;
            box.height = 80;
            box.centerX = 0;
            box.centerY = -50;
            this.addChild(box);

            const label = new Laya.Label();
            label.text = '选择性别：';
            label.fontSize = 36;
            label.color = '#7a8a9a';
            label.x = 0;
            label.y = 20;
            box.addChild(label);

            this.#btnMale = new Laya.Label();
            this.#btnMale.text = '[ 男生 ]';
            this.#btnMale.fontSize = 40;
            this.#btnMale.bold = true;
            this.#btnMale.color = '#5cc8dc';
            this.#btnMale.x = 200;
            this.#btnMale.y = 16;
            this.#btnMale.mouseEnabled = true;
            box.addChild(this.#btnMale);

            this.#btnFemale = new Laya.Label();
            this.#btnFemale.text = '  女生  ';
            this.#btnFemale.fontSize = 40;
            this.#btnFemale.color = '#555';
            this.#btnFemale.x = 350;
            this.#btnFemale.y = 16;
            this.#btnFemale.mouseEnabled = true;
            box.addChild(this.#btnFemale);

            this.#btnMale.on(Laya.Event.CLICK, this, () => this.#setGenderUI('M'));
            this.#btnFemale.on(Laya.Event.CLICK, this, () => this.#setGenderUI('F'));
        }
        this.#setGenderUI('M');
    }

    #setGenderUI(g) {
        this.#gender = g;
        if (g === 'M') {
            this.#btnMale.text = '[ 男生 ]';
            this.#btnMale.color = '#5cc8dc';
            this.#btnMale.bold = true;
            this.#btnFemale.text = '  女生  ';
            this.#btnFemale.color = '#555';
            this.#btnFemale.bold = false;
        } else {
            this.#btnMale.text = '  男生  ';
            this.#btnMale.color = '#555';
            this.#btnMale.bold = false;
            this.#btnFemale.text = '[ 女生 ]';
            this.#btnFemale.color = '#e8a0bf';
            this.#btnFemale.bold = true;
        }
    }
}
