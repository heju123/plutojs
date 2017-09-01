import Rect from "./rect.js";
import globalUtil from "../../util/globalUtil";

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
        this.scrollbarBaseLineV.active = false;
        this.scrollbarOpeLineV = this.produceLine(1, this.style.opeLineColor || "#000", this.style.opeLineAlpha || 0.5);
        this.scrollbarOpeLineV.style.hover = {
            alpha : 0.6
        };
        this.scrollbarOpeLineV.style.active = {
            alpha : 0.7
        };
        this.scrollbarOpeLineV.type = "V";
        this.scrollbarBaseLineV.appendChildren(this.scrollbarOpeLineV);
        this.appendChildren(this.scrollbarBaseLineV);
        //横向滚动条
        this.scrollbarBaseLineH = this.produceLine(2, this.style.baseLineColor || "#000", this.style.baseLineAlpha || 0.25);
        this.scrollbarBaseLineH.active = false;
        this.scrollbarOpeLineH = this.produceLine(2, this.style.opeLineColor || "#000", this.style.opeLineAlpha || 0.5);
        this.scrollbarOpeLineH.style.hover = {
            alpha : 0.6
        };
        this.scrollbarOpeLineH.style.active = {
            alpha : 0.7
        };
        this.scrollbarOpeLineH.type = "H";
        this.scrollbarBaseLineH.appendChildren(this.scrollbarOpeLineH);
        this.appendChildren(this.scrollbarBaseLineH);

        this.scrollbarOpeLineV.registerEvent("mousedown", this.doMouseDown.bind(this, "V"));
        this.scrollbarOpeLineH.registerEvent("mousedown", this.doMouseDown.bind(this, "H"));
        globalUtil.viewState.registerEvent("mousemove", this.doMouseMove.bind(this));
        globalUtil.viewState.registerEvent("mouseup", this.doMouseUp.bind(this));
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
        if (globalUtil.action.hoverComponent === this || this.parentOf(globalUtil.action.hoverComponent))
        {
            this.scrollbarBaseLineH.active = true;
            this.scrollbarBaseLineV.active = true;
        }
        else
        {
            this.scrollbarBaseLineH.active = false;
            this.scrollbarBaseLineV.active = false;
        }
        return true;
    }

    doMouseDown(type, e){
        let x = e.pageX;
        let y = e.pageY;
        let opeLine = this["scrollbarOpeLine" + type];
        this.onScrollMDOffset = type === "V" ? y - opeLine.getRealY() : x - opeLine.getRealX();
        this.onScrollObj = opeLine;
    }

    doMouseMove(e){
        let x = e.pageX;
        let y = e.pageY;
        if (this.onScrollObj)
        {
            let mp = this.onScrollObj.type === "V" ? y : x;
            let setVal;//要设置的滚动条xy值
            let maxVal;//滚动条最大能设置的值
            if (this.onScrollObj.type === "V")
            {
                setVal = mp - this.scrollbarBaseLineV.getRealY() - this.onScrollMDOffset;
                maxVal = this.scrollbarBaseLineV.getHeight() - this.onScrollObj.getHeight();
                setVal = Math.max(setVal, 0);
                setVal = Math.min(setVal, maxVal);
                this.onScrollObj.setY(setVal);
                this.style.contentScrollY = (this.style.contentHeight - this.getHeight()) * (setVal / maxVal);
                this.setScrollY();
            }
            else
            {
                setVal = mp - this.scrollbarBaseLineH.getRealX() - this.onScrollMDOffset;
                maxVal = this.scrollbarBaseLineH.getWidth() - this.onScrollObj.getWidth();
                setVal = Math.max(setVal, 0);
                setVal = Math.min(setVal, maxVal);
                this.onScrollObj.setX(setVal);
                this.style.contentScrollX = (this.style.contentWidth - this.getWidth()) * (setVal / maxVal);
                this.setScrollX();
            }
        }
    }

    doMouseUp(e){
        this.onScrollObj = undefined;
    }

    setScrollX(){
        this.children.forEach((child)=>{
            if (child !== this.scrollbarBaseLineV && child !== this.scrollbarBaseLineH)
            {
                child.style.scrollX = this.style.contentScrollX;
            }
        });
    }
    setScrollY(){
        this.children.forEach((child)=>{
            if (child !== this.scrollbarBaseLineV && child !== this.scrollbarBaseLineH)
            {
                child.style.scrollY = this.style.contentScrollY
            }
        });
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