import Rect from "./rect";
import Component from "./component";

export default class Button extends Rect {
    constructor(parent? : Component) {
        super(parent);
        this.setStyle("textAlign", "center");
        this.setStyle("cursor", "pointer");
    }

    initCfg(cfg : any) : Promise<any>{
        let promise = super.initCfg(cfg);
        this.setStyle("lineHeight", this.getHeight());

        //自适应宽度
        if (this.style.autoWidth)
        {
            this.setStyle("width", this.getTextWidth() + 20);
        }
        return promise;
    }
}