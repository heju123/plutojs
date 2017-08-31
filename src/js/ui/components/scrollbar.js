import Rect from "./rect.js";

export default class Scrollbar extends Rect {
    constructor(parent) {
        super(parent);

        this.setX(0);
        this.setY(0);
        if (!parent)//最顶层
        {
            this.setWidth(globalUtil.canvas.width);
            this.setHeight(globalUtil.canvas.height);
        }
        else
        {
            this.setWidth(parent.getInnerWidth());
            this.setHeight(parent.getInnerHeight());
        }
    }

    initScrollbar(){
        //竖向滚动条
        this.scrollbarBaseLineV = this.produceLine(1, this.style.baseLineColor || "#000", this.style.baseLineAlpha || 0.25);
        this.scrollbarOpeLineV = this.produceLine(1, this.style.opeLineColor || "#000", this.style.opeLineAlpha || 0.5);
        this.scrollbarOpeLineV.style.hover = {
            alpha : 0.6
        };
        this.scrollbarOpeLineV.style.active = {
            alpha : 0.7
        };
        this.scrollbarBaseLineV.appendChildren(this.scrollbarOpeLineV);
        this.appendChildren(this.scrollbarBaseLineV);
        //横向滚动条
        this.scrollbarBaseLineH = this.produceLine(2, this.style.baseLineColor || "#000", this.style.baseLineAlpha || 0.25);
        this.scrollbarOpeLineH = this.produceLine(2, this.style.opeLineColor || "#000", this.style.opeLineAlpha || 0.5);
        this.scrollbarOpeLineH.style.hover = {
            alpha : 0.6
        };
        this.scrollbarOpeLineH.style.active = {
            alpha : 0.7
        };
        this.scrollbarBaseLineH.appendChildren(this.scrollbarOpeLineH);
        this.appendChildren(this.scrollbarBaseLineH);

        this.scrollbarOpeLineV.registerEvent("mousedown", this.doMouseDown.bind(this));
        this.scrollbarOpeLineH.registerEvent("mousedown", this.doMouseDown.bind(this));
    }

    initCfg(cfg){
        super.initCfg(cfg);
        this.initScrollbar();
    }

    draw(ctx)
    {
        if (!super.draw(ctx))
        {
            return false;
        }
        ctx.save();
        ctx.beginPath();

        ctx.closePath();
        ctx.restore();
        return true;
    }

    doMouseDown(e){
        console.log(e);
    }

    /** 生成滚动条
     *
     * @param oritation 方向，1：竖向滚动条；2：横向滚动条
     */
    produceLine(oritation, lineColor, alpha)
    {
        oritation = oritation || 1;
        let padding = 0;
        let swidth = this.style.scrollbarWidth || 10;
        let radius = this.style.scrollbarRadius || 6;
        let scrollbarX = oritation === 1 ? this.getWidth() - swidth : padding;
        let scrollbarY = oritation === 2 ? this.getHeight() - swidth : padding;

        let line = new Rect(this);
        line.setX(scrollbarX);
        line.setY(scrollbarY);
        if (oritation === 1)
        {
            line.setWidth(swidth);
            line.setHeight(this.getHeight() - padding * 2);
        }
        else
        {
            line.setHeight(swidth);
            line.setWidth(this.getWidth() - padding * 2);
        }
        line.style.backgroundColor = lineColor;
        line.style.alpha = alpha;
        line.style.borderRadius = radius;
        line.init();
        return line;
    }

    appendChildren(child){
        super.appendChildren(child);

        this.propagationDoLayout(this);
    }

    doLayout(){
        let maxWidth = 0;
        let maxHeight = 0;
        this.children.forEach((child, index)=>{
            maxWidth = Math.max(maxWidth, child.getX() + child.getWidth());
            maxHeight = Math.max(maxHeight, child.getY() + child.getHeight());
        });
        this.style.contentWidth = maxWidth;
        this.style.contentHeight = maxHeight;

        //是否显示滚动条
        if (this.scrollbarBaseLineH)
        {
            if (this.style.contentWidth <= this.getWidth())
            {
                this.scrollbarBaseLineH.active = false;
            }
            else
            {
                this.scrollbarOpeLineH.setWidth(this.scrollbarBaseLineH.getWidth() * (this.getWidth() / this.style.contentWidth));
            }
        }
        if (this.scrollbarBaseLineV)
        {
            if (this.style.contentHeight <= this.getHeight())
            {
                this.scrollbarBaseLineV.active = false;
            }
            else
            {
                this.scrollbarOpeLineV.setHeight(this.scrollbarBaseLineV.getHeight() * (this.getHeight() / this.style.contentHeight));
            }
        }
    }
}