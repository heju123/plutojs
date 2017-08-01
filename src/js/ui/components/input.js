/**
 * Created by heju on 2017/7/30.
 */
import Rect from "./rect.js";
import globalUtil from "../../util/globalUtil";

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
        if (globalUtil.focusComponent === this)
        {
        }

        ctx.restore();
        return true;
    }
}