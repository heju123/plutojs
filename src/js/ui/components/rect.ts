/**
 * Created by heju on 2017/7/14.
 */
import commonUtil from "../../util/commonUtil";
import globalUtil from "../../util/globalUtil";
import Component from "./component";
import ViewState from "../viewState";

export default class Rect extends Component{
    constructor(parent? : Component | ViewState) {
        super(parent);
    }

    initCfg(cfg : any) : Promise<any>{
        let promise = super.initCfg(cfg);
        return promise;
    }

    draw(ctx : CanvasRenderingContext2D) : boolean{
        if (!super.draw(ctx))
        {
            return false;
        }
        ctx.save();
        this.setCommonStyle(ctx);
        ctx.beginPath();
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
        if (this.currentBackgroundImage && this.currentBackgroundImage.dom)
        {
            ctx.save();
            this.setClip(ctx);//绘制图片前需要先剪切，避免图片超出当前组件
            if (this.currentBackgroundImage.clip)
            {
                ctx.drawImage(this.currentBackgroundImage.dom,
                    this.currentBackgroundImage.clip[0], this.currentBackgroundImage.clip[1],
                    this.currentBackgroundImage.clip[2], this.currentBackgroundImage.clip[3],
                    this.getRealX(), this.getRealY(), this.getWidth(), this.getHeight());
            }
            else
            {
                ctx.drawImage(this.currentBackgroundImage.dom, this.getRealX(), this.getRealY(), this.getWidth(), this.getHeight());
            }
            ctx.restore();
        }
        ctx.closePath();
        if (this.style.borderWidth && this.style.borderColor)
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
            ctx.stroke();//调用stroke后得到的图形宽高会增大lineWidth个像素，fill则不会
            ctx.closePath();
        }

        //绘制文字
        if (this.text && this.text.length > 0)
        {
            let Input = require("./input").default;
            ctx.save();
            this.setClip(ctx);
            ctx.beginPath();

            ctx.font = this.style.fontSize + " " + this.style.fontFamily;
            ctx.fillStyle = this.style.fontColor;
            ctx.textBaseline = this.style.textBaseline || "hanging";
            let char;
            let cindex;
            this.text.forEach((row, index)=>{
                if (this instanceof Input)
                {
                    char = undefined;
                    cindex = 0;
                    while (char = row.charAt(cindex))
                    {
                        ctx.fillText(char, this.getTextRealX() + cindex * parseInt(this.style.fontSize, 10),
                            this.getTextRealY() + this.style.lineHeight / 2 - parseInt(this.style.fontSize, 10) / 2 + this.style.lineHeight * index);
                        cindex++;
                    }
                }
                else
                {
                    ctx.fillText(row, this.getTextRealX(),
                        this.getTextRealY() + this.style.lineHeight / 2 - parseInt(this.style.fontSize, 10) / 2 + this.style.lineHeight * index);
                }
            });
            ctx.closePath();
            ctx.restore();
        }
        ctx.restore();

        return true;
    }

    /** 设置后避免超出当前组件范围 */
    protected setClip(ctx : CanvasRenderingContext2D){
        ctx.beginPath();
        if (this.isDoingParentClip)
        {
            if (this.needTranslateOriginOfCoor2Center())
            {
                this.setOriginalCoor2Center(ctx);
            }
            //设置scale或rotate后可以将效果传递给子节点
            this.setScaleEnable(ctx);//缩放
            this.setRotateEnable(ctx);//旋转
            if (this.needTranslateOriginOfCoor2Center())
            {
                this.restoreOriginalCoor2Zero(ctx);
            }
        }
        if (this.hasClip)//是否需要剪切边界
        {
            if (this.style.borderRadius)
            {
                this.getRectRadiusPath(this, ctx, this.style.borderRadius, -(this.style.borderWidth || 0));
            }
            else
            {
                ctx.rect(this.getRealX() + (this.style.borderWidth || 0),
                    this.getRealY() + (this.style.borderWidth || 0),
                    this.getInnerWidth(), this.getInnerHeight());
            }
            ctx.clip();
        }
        ctx.closePath();
    }

    private getRectRadiusPath(arg1? : any, arg2? : any, arg3? : any, arg4? : any, arg5? : any, arg6? : any, arg7? : any) : void{
        if (arguments.length <= 4)
        {
            this.getRectRadiusPath_self(arg1, arg2, arg3, arg4);
        }
        else
        {
            this.getRectRadiusPath_xywh(arg1, arg2, arg3, arg4, arg5, arg6, arg7);
        }
    }
    /**
     * 获取圆角矩形路径
     *
     * @param self 当前组件
     * @param radius 圆角半径
     * @param padding 整体扩大的像素
     */
    private getRectRadiusPath_self(self : Component, ctx :CanvasRenderingContext2D, radius : number, padding : number) : void{
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
    private getRectRadiusPath_xywh(px : number, py : number, pwidth : number, pheight : number, ctx : CanvasRenderingContext2D, radius : number, padding : number) : void{
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
    protected inParentArea(com : Component) : number{
        if (!com.parent)
        {
            return -1;
        }
        else{
            let comX = com.getRealX();
            let comY = com.getRealY();
            let comWidth = com.getWidth();
            let comHeight = com.getHeight();
            //设置比例
            if (com.style.scale !== undefined && com.style.scale !== "1,1")
            {
                let scaleArr = com.style.scale.split(",");
                let newWidth = comWidth * parseFloat(scaleArr[0]);
                let newHeight = comHeight * parseFloat(scaleArr[1]);
                comX = comX - (newWidth - comWidth) / 2;
                comY = comY - (newHeight - comHeight) / 2;
                comWidth = newWidth;
                comHeight = newHeight;
            }
            if (comX + comWidth < 0 || comX > this.viewState.canvas.width
                || comY + comHeight < 0 || comY > this.viewState.canvas.height)//不在屏幕范围内
            {
                return 0;
            }
            if (this.getRealXRecursion(com.parent) + com.parent.getInnerWidth() <= comX
                || this.getRealXRecursion(com.parent) >= comX + comWidth
                || this.getRealYRecursion(com.parent) + com.parent.getInnerHeight() <= comY
                || this.getRealYRecursion(com.parent) >= comY + comHeight)//不在parent范围内
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
    protected isPointInComponent(ctx : CanvasRenderingContext2D, px : number, py : number) : boolean{
        ctx.save();
        ctx.beginPath();
        if (this.needTranslateOriginOfCoor2Center())
        {
            this.setOriginalCoor2Center(ctx);
        }
        this.setScaleEnable(ctx);
        this.setRotateEnable(ctx);//旋转
        if (this.needTranslateOriginOfCoor2Center())
        {
            this.restoreOriginalCoor2Zero(ctx);
        }
        if (this.style.borderRadius)
        {
            this.getRectRadiusPath(this, ctx, this.style.borderRadius);
        }
        else
        {
            ctx.rect(this.getRealX(), this.getRealY(), this.getWidth(), this.getHeight());
        }
        let ret = ctx.isPointInPath(px, py);
        ctx.closePath();
        ctx.restore();
        return ret;
    }
}