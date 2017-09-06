import Rect from "./rect.js";

export default class Button extends Rect {
    constructor(parent) {
        super(parent);
        this.setStyle("textAlign", "center");
    }

    initCfg(cfg){
        super.initCfg(cfg);
        this.setStyle("lineHeight", this.getHeight());
        //自适应宽度
        if (this.style.autoWidth)
        {
            this.setStyle("width", this.getTextWidth() + 20);
        }
    }
}