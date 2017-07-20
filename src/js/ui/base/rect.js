/**
 * Created by heju on 2017/7/14.
 */
import commonUtil from "../../util/commonUtil.js";

export default class Rect{
    constructor(style) {
        this.x = style.x;
        this.y = style.y;
        this.width = style.width;
        this.height = style.height;
        this.backgroundColor = style.backgroundColor;
    }

    draw(ctx){
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}