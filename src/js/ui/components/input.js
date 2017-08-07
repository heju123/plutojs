/**
 * Created by heju on 2017/7/30.
 */
import Rect from "./rect.js";
import globalUtil from "../../util/globalUtil";
import commonUtil from "../../util/commonUtil";

export default class Input extends Rect {
    constructor(parent) {
        super(parent);
        this.fontFamily = globalUtil.viewState.defaultFontFamily;
        this.fontSize = globalUtil.viewState.defaultFontSize;
    }

    initCfg(cfg){
        super.initCfg(cfg);
        this.text = cfg.text;
    }

    draw(ctx) {
        if (!super.draw(ctx)) {
            return false;
        }

        ctx.save();
        this.setClip(ctx);

        ctx.beginPath();
        //focus
        if (globalUtil.action.focusComponent === this) {
            this.text = globalUtil.action.inputListenerDom.value;
        }
        //绘制文字
        if (this.text)
        {
            ctx.font=this.fontSize + " " + this.fontFamily;
            ctx.textBaseline="hanging";
            ctx.fillText(this.text, this.getRealX(this),
                this.getRealY(this) + this.style.height / 2 - parseInt(this.fontSize, 10) / 2);
        }

        ctx.restore();
        return true;
    }
}