/**
 * Created by heju on 2017/7/14.
 */
import commonUtil from "../../util/commonUtil.js";
import globalUtil from "../../util/globalUtil.js";
import Component from "./component.js";

export default class Rect extends Component{
    constructor(parent) {
        super(parent);
    }

    initCfg(cfg){
        super.initCfg(cfg);

        let $this = this;

        if (this.style.backgroundImage)
        {
            let img = new Image();
            img.onload = function(){
                $this.backgroundImageDom = this;
                if (!this.style.width || this.style.width === "auto")
                {
                    $this.style.width = $this.backgroundImageDom.width;
                }
                if (!this.style.height || this.style.height === "auto")
                {
                    $this.style.height = $this.backgroundImageDom.height;
                }
            };
            img.src = this.style.backgroundImage;
        }
    }

    draw(ctx){
        if (!super.draw(ctx))
        {
            return false;
        }
        ctx.save();
        this.setParentClip(ctx);
        ctx.beginPath();
        if (this.style.backgroundColor)
        {
            ctx.fillStyle = this.style.backgroundColor;
            ctx.fillRect(this.getRealX(this), this.getRealY(this), this.style.width, this.style.height);
        }
        if (this.style.backgroundImage && this.backgroundImageDom)
        {
            ctx.drawImage(this.backgroundImageDom, this.getRealX(this), this.getRealY(this), this.style.width, this.style.height);
        }
        if (this.style.borderWidth)
        {
            let bcolor = this.style.borderColor || this.style.backgroundColor;
            ctx.lineWidth = this.style.borderWidth;
            ctx.strokeStyle = bcolor;
            ctx.strokeRect(this.getRealX(this), this.getRealY(this), this.style.width, this.style.height);
        }
        ctx.restore();
        return true;
    }

    /** 设置后避免超出parent范围 */
    setParentClip(ctx){
        if (this.parent)
        {
            ctx.rect(this.getRealX(this.parent), this.getRealY(this.parent), this.parent.style.width, this.parent.style.height);
            ctx.clip();
        }
    }

    /**
     * 是否在parent区域内
     *
     * @return -1：无parent；0：不在范围内；1：在范围内
     */
    inParentArea(com){
        if (!com.parent)
        {
            return -1;
        }
        else{
            if (this.getRealX(com.parent) + com.parent.style.width < this.getRealX(com)
                || this.getRealX(com.parent) > this.getRealX(com) + com.style.width
                || this.getRealY(com.parent) + com.parent.style.height < this.getRealY(com)
                || this.getRealY(com.parent) > this.getRealY(com) + com.style.height)//不在parent范围内
            {
                return 0;
            }
            else
            {
                return 1;
            }
        }
    }

    /**
     * 判断鼠标坐标是否在控件范围内
     *
     * @param px 鼠标x
     * @param py 鼠标y
     * @return true：在范围内
     */
    isPointInComponent(px, py){
        if (px >= this.getRealX(this) && px <= this.getRealX(this) + this.style.width
            && py >= this.getRealY(this) && py <= this.getRealY(this) + this.style.height)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
}