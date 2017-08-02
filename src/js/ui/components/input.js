/**
 * Created by heju on 2017/7/30.
 */
import Rect from "./rect.js";
import globalUtil from "../../util/globalUtil";
import commonUtil from "../../util/commonUtil";

export default class Input extends Rect {
    constructor(parent) {
        super(parent);

        this.registerEvent("mousedown", (e)=>{
            globalUtil.focusComponent = this;
        });
    }

    initCfg(cfg){
        super.initCfg(cfg);
    }

    draw(ctx){
        if (!super.draw(ctx))
        {
            return false;
        }

        ctx.save();
        this.setParentClip(ctx);

        ctx.beginPath();
        //focus
        if (globalUtil.focusComponent === this && !this.originalStyle)
        {
            this.originalStyle = commonUtil.copyObject(this.style);
            commonUtil.copyObject(this.style.focus, this.style, true);
        }
        else if (globalUtil.focusComponent !== this && this.originalStyle)
        {
            this.style = this.originalStyle;
            this.originalStyle = undefined;
        }

        ctx.restore();
        return true;
    }
}