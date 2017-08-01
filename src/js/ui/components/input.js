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

    draw(ctx){
        if (!super.draw(ctx))
        {
            return false;
        }

        ctx.save();
        this.setClip(ctx);

        ctx.beginPath();
        //focus
        if (globalUtil.focusComponent === this)
        {
            ctx.strokeStyle = "#ff0000";
            ctx.strokeRect(this.getRealX(this), this.getRealY(this), this.width, this.height);
        }

        ctx.restore();
        return true;
    }
}