/**
 * Created by heju on 2017/7/30.
 */
import Rect from "./rect.js";
import globalUtil from "../../util/globalUtil";
import commonUtil from "../../util/commonUtil";

export default class Input extends Rect {
    constructor(parent) {
        super(parent);
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
        if (globalUtil.action.focusComponent === this)
        {
        }
        ctx.restore();
        return true;
    }
}