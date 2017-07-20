/**
 * Created by heju on 2017/7/14.
 */
import commonUtil from "../../util/commonUtil.js";
import G2d from "./g2d.js";

export default class Rect extends G2d{
    constructor(style) {
        super();
        this.x = style.x;
        this.y = style.y;
        this.width = style.width;
        this.height = style.height;
        this.backgroundColor = style.backgroundColor;
    }

    draw(ctx){
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(this.getRealX(this), this.getRealY(this), this.width, this.height);
    }
}