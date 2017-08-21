import Rect from "./rect.js";

export default class Button extends Rect {
    constructor(parent) {
        super(parent);
        this.style.textAlign = "center";
    }

    initCfg(cfg){
        super.initCfg(cfg);
        this.style.lineHeight = this.getHeight();
    }
}