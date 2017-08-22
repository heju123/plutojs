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
    }

    draw(ctx){
        if (!super.draw(ctx))
        {
            return false;
        }
        ctx.save();
        this.setParentClip(ctx);
        ctx.beginPath();
        this.setCommonStyle(ctx);
        if (this.style.backgroundColor)
        {
            ctx.fillStyle = this.style.backgroundColor;
            ctx.fillRect(this.getRealX(), this.getRealY(), this.getWidth(), this.getHeight());
        }
        if (this.style.backgroundImage && this.backgroundImageDom)
        {
            if (this.style.backgroundImageClip)
            {
                ctx.drawImage(this.backgroundImageDom,
                    this.style.backgroundImageClip[0], this.style.backgroundImageClip[1], this.style.backgroundImageClip[2], this.style.backgroundImageClip[3],
                    this.getRealX(), this.getRealY(), this.getWidth(), this.getHeight());
            }
            else
            {
                ctx.drawImage(this.backgroundImageDom, this.getRealX(), this.getRealY(), this.getWidth(), this.getHeight());
            }
        }
        if (this.style.borderWidth)
        {
            let bcolor = this.style.borderColor || this.style.backgroundColor;
            ctx.lineWidth = this.style.borderWidth;
            ctx.strokeStyle = bcolor;
            ctx.strokeRect(this.getRealX(), this.getRealY(), this.getWidth(), this.getHeight());
        }
        ctx.restore();

        //绘制文字
        ctx.save();
        this.setClip(ctx);
        ctx.beginPath();
        this.setCommonStyle(ctx);
        if (this.text && this.text.length > 0)
        {
            ctx.font=this.style.fontSize + " " + this.style.fontFamily;
            ctx.textBaseline="hanging";
            this.text.forEach((row, index)=>{
                row.forEach((char, cindex)=>{
                    ctx.fillText(char, this.getTextRealX() + cindex * parseInt(this.style.fontSize, 10),
                        this.getTextRealY() + this.style.lineHeight / 2 - parseInt(this.style.fontSize, 10) / 2 + this.style.lineHeight * index);
                });
            });
        }
        ctx.restore();
        return true;
    }

    /** 设置后避免超出parent范围 */
    setParentClip(ctx){
        if (this.parent)
        {
            ctx.rect(this.getRealXRecursion(this.parent), this.getRealYRecursion(this.parent), this.parent.getWidth(), this.parent.getHeight());
            ctx.clip();
        }
    }
    /** 设置后避免超出当前组件范围 */
    setClip(ctx){
        ctx.rect(this.getRealX(), this.getRealY(), this.getWidth(), this.getHeight());
        ctx.clip();
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
            if (this.getRealXRecursion(com.parent) + com.parent.getWidth() < this.getRealX()
                || this.getRealXRecursion(com.parent) > this.getRealX() + com.getWidth()
                || this.getRealYRecursion(com.parent) + com.parent.getHeight() < this.getRealY()
                || this.getRealYRecursion(com.parent) > this.getRealY() + com.getHeight())//不在parent范围内
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
        if (px >= this.getRealX(this) && px <= this.getRealX(this) + this.getWidth()
            && py >= this.getRealY(this) && py <= this.getRealY(this) + this.getHeight())
        {
            return true;
        }
        else
        {
            return false;
        }
    }
}