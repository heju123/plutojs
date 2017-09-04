import Rect from "./rect.js";

export default class Button extends Rect {
    constructor(parent) {
        super(parent);
        this.setStyle("textAlign", "center");
    }

    initCfg(cfg){
        super.initCfg(cfg);
        this.setStyle("lineHeight", this.getHeight());
    }
}