/**
 * Created by heju on 2017/7/14.
 */
import commonUtil from "../../util/commonUtil.js";
import G2d from "./g2d.js";

export default class Rect extends G2d{
    constructor(cfg) {
        super(cfg);
        let $this = this;
        this.width = cfg.style.width;
        this.height = cfg.style.height;
        this.backgroundColor = cfg.style.backgroundColor;
        this.backgroundImage = cfg.style.backgroundImage;

        if (this.backgroundImage)
        {
            let img = new Image();
            img.onload = function(){
                $this.backgroundImageDom = this;
            };
            img.src = this.backgroundImage;
            if (this.width && this.width != "auto")
            {
                img.width = this.width;
            }
            if (this.height && this.height != "auto")
            {
                img.height = this.height;
            }
        }
    }

    draw(ctx){
        if (this.backgroundColor)
        {
            ctx.fillStyle = this.backgroundColor;
            ctx.fillRect(this.getRealX(this), this.getRealY(this), this.width, this.height);
        }

        if (this.backgroundImage && this.backgroundImageDom)
        {
            ctx.drawImage(this.backgroundImageDom, this.getRealX(this), this.getRealY(this),
                this.backgroundImageDom.width, this.backgroundImageDom.height);
        }
    }
}