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
        super.draw(ctx);
    }
}