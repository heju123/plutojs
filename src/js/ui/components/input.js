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
        this.registerEvent("mousemove", (e)=>{
            globalUtil.hoverComponent = this;
        });
    }

    initCfg(cfg){
        super.initCfg(cfg);
    }

    draw(ctx){
        this.focusable();
        if (!super.draw(ctx))
        {
            return false;
        }

        ctx.save();
        this.setParentClip(ctx);

        ctx.beginPath();
        //focus
        if (globalUtil.focusComponent === this)
        {
        }
        ctx.restore();
        return true;
    }
}