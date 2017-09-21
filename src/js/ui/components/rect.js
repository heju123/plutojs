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
        ctx.beginPath();
        this.setCommonStyle(ctx);
        if (this.style.backgroundColor)
        {
            ctx.fillStyle = this.style.backgroundColor;
            if (this.style.borderRadius)
            {
                this.getRectRadiusPath(this, ctx, this.style.borderRadius);
            }
            else
            {
                ctx.rect(this.getRealX(), this.getRealY(), this.getWidth(), this.getHeight());
            }
            ctx.fill();
        }
        ctx.save();
        this.setClip(ctx);//绘制图片前需要先剪切，避免图片超出当前组件
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
        ctx.restore();
        ctx.closePath();
        if (this.style.borderWidth)
        {
            ctx.beginPath();
            let bcolor = this.style.borderColor || this.style.backgroundColor;
            ctx.lineWidth = this.style.borderWidth;
            ctx.strokeStyle = bcolor;
            if (this.style.borderRadius)
            {
                this.getRectRadiusPath(this, ctx, this.style.borderRadius, -this.style.borderWidth / 2);
            }
            else
            {
                ctx.rect(this.getRealX() + this.style.borderWidth / 2, this.getRealY() + this.style.borderWidth / 2,
                    this.getWidth() - this.style.borderWidth, this.getHeight() - this.style.borderWidth);
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

    /** 设置后避免超出当前组件范围 */
    setClip(ctx){
        if (this.style.borderRadius)
        {
            this.getRectRadiusPath(this, ctx, this.style.borderRadius, -(this.style.borderWidth || 0));
        }
        else
        {
            ctx.rect(this.getRealX() + (this.style.borderWidth || 0) - 0.5,
                this.getRealY() + (this.style.borderWidth || 0) - 0.5,
                this.getInnerWidth() + 1, this.getInnerHeight() + 1);//clip后矩形会整体缩小1个像素
        }
        ctx.clip();
    }

    getRectRadiusPath(){
        if (arguments.length <= 4)
        {
            this.getRectRadiusPath_self(arguments[0], arguments[1], arguments[2], arguments[3]);
        }
        else
        {
            this.getRectRadiusPath_xywh(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6]);
        }
    }
    /**
     * 获取圆角矩形路径
     *
     * @param self 当前组件
     * @param radius 圆角半径
     * @param padding 整体扩大的像素
     */
    getRectRadiusPath_self(self, ctx, radius, padding){
        this.getRectRadiusPath_xywh(self.getRealX(), self.getRealY(), self.getWidth(), self.getHeight(), ctx, radius, padding);
    }
    /**
     * 获取圆角矩形路径
     *
     * @param px 绝对x坐标
     * @param py 绝对y坐标
     * @param pwidth 矩形宽
     * @param pheight 矩形高
     * @param radius 圆角半径
     * @param padding 整体扩大的像素
     */
    getRectRadiusPath_xywh(px, py, pwidth, pheight, ctx, radius, padding){
        padding = padding || 0;
        let x = px - padding;
        let y = py - padding;
        let width = pwidth + padding * 2;
        let height = pheight + padding * 2;
        radius += padding;
        ctx.moveTo(x + radius + padding, y);
        ctx.lineTo(x + width - radius - padding, y);
        ctx.arcTo(x + width, y,x + width, y + radius + padding, radius);
        ctx.lineTo(x + width, y + height - radius - padding);
        ctx.arcTo(x + width, y + height, x + width - radius - padding, y + height, radius);
        ctx.lineTo(x + radius + padding, y + height);
        ctx.arcTo(x, y + height, x, y + height - radius - padding, radius);
        ctx.lineTo(x, y + radius + padding);
        ctx.arcTo(x, y, x + radius + padding, y, radius);
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
            if (this.getRealXRecursion(com.parent) + com.parent.getInnerWidth() <= com.getRealX()
                || this.getRealXRecursion(com.parent) >= com.getRealX() + com.getWidth()
                || this.getRealYRecursion(com.parent) + com.parent.getInnerHeight() <= com.getRealY()
                || this.getRealYRecursion(com.parent) >= com.getRealY() + com.getHeight())//不在parent范围内
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