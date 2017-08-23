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
        if (this.style.borderRadius)
        {
            this.setRadiusClip(ctx, this.style.borderRadius);
        }
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
            ctx.beginPath();
            let bcolor = this.style.borderColor || this.style.backgroundColor;
            ctx.lineWidth = this.style.borderWidth;
            ctx.strokeStyle = bcolor;
            if (this.style.borderRadius)
            {
                this.getRadiusPath(ctx, this.style.borderRadius);
            }
            else
            {
                ctx.rect(this.getRealX(), this.getRealY(), this.getWidth(), this.getHeight());
            }
            ctx.stroke();
            ctx.closePath();
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
     * 获取圆角矩形路径
     *
     * @param radius 圆角半径
     */
    getRadiusPath(ctx, radius){
        ctx.moveTo(this.getRealX() + radius, this.getRealY());
        ctx.lineTo(this.getRealX() + this.getWidth() - radius, this.getRealY());
        ctx.arcTo(this.getRealX() + this.getWidth(), this.getRealY(),this.getRealX() + this.getWidth(), this.getRealY() + radius, radius);
        ctx.lineTo(this.getRealX() + this.getWidth(), this.getRealY() + this.getHeight() - radius);
        ctx.arcTo(this.getRealX() + this.getWidth(), this.getRealY() + this.getHeight(), this.getRealX() + this.getWidth() - radius, this.getRealY() + this.getHeight(), radius);
        ctx.lineTo(this.getRealX() + radius, this.getRealY() + this.getHeight());
        ctx.arcTo(this.getRealX(), this.getRealY() + this.getHeight(), this.getRealX(), this.getRealY() + this.getHeight() - radius, radius);
        ctx.lineTo(this.getRealX(), this.getRealY() + radius);
        ctx.arcTo(this.getRealX(), this.getRealY(), this.getRealX() + radius, this.getRealY(), radius);
    }
    /**
     * 设置后可以绘出圆角矩形
     *
     * @param radius 圆角半径
     */
    setRadiusClip(ctx, radius){
        //必须完全包含在父组件下才能实现圆角，因为不能连续两次执行clip，是目前的一个缺陷
        if (this.getRealXRecursion(this.parent) + this.parent.getWidth() >= this.getRealX() + this.getWidth()
            && this.getRealXRecursion(this.parent) <= this.getRealX()
            && this.getRealYRecursion(this.parent) + this.parent.getHeight() >= this.getRealY() + this.getHeight()
            && this.getRealYRecursion(this.parent) <= this.getRealY())
        {
            this.getRadiusPath(ctx, radius);
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