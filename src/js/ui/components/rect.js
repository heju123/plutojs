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
        let $this = this;

        if (cfg.style)
        {
            this.width = cfg.style.width;
            this.height = cfg.style.height;
            this.backgroundColor = cfg.style.backgroundColor;
            this.backgroundImage = cfg.style.backgroundImage;
        }

        if (this.backgroundImage)
        {
            let img = new Image();
            img.onload = function(){
                $this.backgroundImageDom = this;
                if (!this.width || this.width === "auto")
                {
                    $this.width = $this.backgroundImageDom.width;
                }
                if (!this.height || this.height === "auto")
                {
                    $this.height = $this.backgroundImageDom.height;
                }
            };
            img.src = this.backgroundImage;
        }

        super.initCfg(cfg);
    }

    draw(ctx){
        ctx.beginPath();
        let parentArea = this.inParentArea(this);
        if (parentArea === 0)
        {
            return;
        }
        if (this.parent)//超出parent范围时遮挡
        {
            ctx.rect(this.getRealX(this.parent), this.getRealY(this.parent), this.parent.width, this.parent.height);
            ctx.clip();
        }
        if (this.backgroundColor)
        {
            ctx.fillStyle = this.backgroundColor;
            ctx.fillRect(this.getRealX(this), this.getRealY(this), this.width, this.height);
        }
        if (this.backgroundImage && this.backgroundImageDom)
        {
            ctx.drawImage(this.backgroundImageDom, this.getRealX(this), this.getRealY(this), this.width, this.height);
        }
        super.draw(ctx);
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
            if (this.getRealX(com.parent) + com.parent.width < this.getRealX(com)
                || this.getRealX(com.parent) > this.getRealX(com) + com.width
                || this.getRealY(com.parent) + com.parent.height < this.getRealY(com)
                || this.getRealY(com.parent) > this.getRealY(com) + com.height)//不在parent范围内
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
        if (px >= this.getRealX(this) && px <= this.getRealX(this) + this.width
            && py >= this.getRealY(this) && py <= this.getRealY(this) + this.height)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
}