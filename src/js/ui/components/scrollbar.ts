import Rect from "./rect";
import globalUtil from "../../util/globalUtil";
import Component from "./component";
import Event from "../../event/type/event";
import MouseEvent from "../../event/type/mouseEvent";
import WheelEvent from "../../event/type/wheelEvent";

const HOVER_TIME_OUT = 500;//hover时执行定时函数间隔
const DEFAULT_SCROLLBAR_WIDTH = 10;//滚动条的默认宽度
export default class Scrollbar extends Rect {
    private scrollbarBaseLineV : Component;
    private scrollbarOpeLineV : Component;
    private scrollbarBaseLineH : Component;
    private scrollbarOpeLineH : Component;
    private doMouseMoveBind : Function;
    private doMouseUpBind : Function;
    private doTimeoutLock : boolean;
    private onScrollObj : Component;
    private onScrollMDOffset : number;

    constructor(parent? : Component) {
        super(parent);

        if (!this.style.scrollText)
        {
            this.setX(0);
            this.setY(0);
            this.setWidth("100%");
            this.setHeight("100%");
        }

        this.setStyle({
            contentScrollX : 0, //内容整体滚动的x轴距离
            contentScrollY : 0, //内容整体滚动的y轴距离
            showHScroll : false,//是否显示水平滚动条
            showVScroll : false //是否显示垂直滚动条
        });
    }

    private initScrollbar(){
        //竖向滚动条
        this.scrollbarBaseLineV = this.produceLine(1, this.style.baseLineColor || "#000", this.style.baseLineAlpha || 0.25);
        this.scrollbarBaseLineV.active = false;
        this.scrollbarOpeLineV = this.produceLine(1, this.style.opeLineColor || "#000", this.style.opeLineAlpha || 0.4);
        this.scrollbarOpeLineV.setStyle({
            hover : {
                alpha : 0.5
            },
            active : {
                alpha : 0.7
            }
        });
        this.scrollbarOpeLineV.type = "V";
        this.scrollbarBaseLineV.appendChildren(this.scrollbarOpeLineV);
        this.appendChildren(this.scrollbarBaseLineV);
        //横向滚动条
        this.scrollbarBaseLineH = this.produceLine(2, this.style.baseLineColor || "#000", this.style.baseLineAlpha || 0.25);
        this.scrollbarBaseLineH.active = false;
        this.scrollbarOpeLineH = this.produceLine(2, this.style.opeLineColor || "#000", this.style.opeLineAlpha || 0.4);
        this.scrollbarOpeLineH.setStyle({
            hover : {
                alpha : 0.5
            },
            active : {
                alpha : 0.7
            }
        });
        this.scrollbarOpeLineH.type = "H";
        this.scrollbarBaseLineH.appendChildren(this.scrollbarOpeLineH);
        this.appendChildren(this.scrollbarBaseLineH);

        //注册事件
        this.scrollbarOpeLineV.registerEvent("mousedown", this.doMouseDown.bind(this, "V"));
        this.scrollbarOpeLineH.registerEvent("mousedown", this.doMouseDown.bind(this, "H"));
        this.doMouseMoveBind = this.doMouseMove.bind(this);
        this.doMouseUpBind = this.doMouseUp.bind(this);
        globalUtil.viewState.registerEvent("mousemove", this.doMouseMoveBind);
        globalUtil.viewState.registerEvent("mouseup", this.doMouseUpBind);
        this.registerEvent("mousewheel", this.doMouseWheel.bind(this));
    }

    initCfg(cfg : any) : Promise<any>{
        let promise = super.initCfg(cfg);
        this.initScrollbar();
        return promise;
    }

    draw(ctx : CanvasRenderingContext2D) : boolean
    {
        if (!super.draw(ctx))
        {
            return false;
        }
        if (this.scrollbarBaseLineH && this.scrollbarBaseLineV)
        {
            if (globalUtil.action.hoverComponent === this
                || this.parentOf(globalUtil.action.hoverComponent) || this.onScrollObj)
            {
                this.scrollbarBaseLineH.active = this.style.showHScroll;
                this.scrollbarBaseLineV.active = this.style.showVScroll;
            }
            else
            {
                this.scrollbarBaseLineH.active = false;
                this.scrollbarBaseLineV.active = false;
            }
        }
        return true;
    }

    /** 组件被Hover时执行的定时函数 */
    private doHoverTimeout(){
        this.doTimeoutLock = true;
        this.getContentWH();
        this.showScrollbar();

        if (this.isHover)
        {
            setTimeout(this.doHoverTimeout.bind(this), HOVER_TIME_OUT);
        }
        else
        {
            this.doTimeoutLock = false;
        }
    }

    onHover(){
        super.onHover();
        if (!this.doTimeoutLock)
        {
            setTimeout(this.doHoverTimeout.bind(this), HOVER_TIME_OUT);
        }
    }

    /** 获取滚动条内容占用的高宽 */
    private getContentWH(){
        let maxWidth = 0;
        let maxHeight = 0;
        if (this.style.scrollText && this.text)
        {
            maxHeight = this.getTextHeight();
            maxWidth = this.getTextWidth();
        }
        else
        {
            this.children.forEach((child, index)=>{
                if (child !== this.scrollbarBaseLineV && child !== this.scrollbarBaseLineH)
                {
                    maxWidth = Math.max(maxWidth, child.style.x + child.getWidth());
                    maxHeight = Math.max(maxHeight, child.style.y + child.getHeight());
                }
            });
        }
        this.setStyle({
            contentWidth : maxWidth + (this.style.scrollbarWidth || DEFAULT_SCROLLBAR_WIDTH),
            contentHeight : maxHeight + (this.style.scrollbarWidth || DEFAULT_SCROLLBAR_WIDTH)
        });
    }

    /** 判断是否显示滚动条 */
    private showScrollbar(){
        if (this.scrollbarBaseLineH)
        {
            if (this.style.contentWidth <= this.getInnerWidth())
            {
                this.setStyle("showHScroll", false);
            }
            else
            {
                this.setStyle("showHScroll", true);
                this.scrollbarOpeLineH.setWidth(this.scrollbarBaseLineH.getWidth() * (this.getInnerWidth() / this.style.contentWidth));
            }
        }
        if (this.scrollbarBaseLineV)
        {
            if (this.style.contentHeight <= this.getInnerHeight())
            {
                this.setStyle("showVScroll", false);
            }
            else
            {
                this.setStyle("showVScroll", true);
                this.scrollbarOpeLineV.setHeight(this.scrollbarBaseLineV.getHeight() * (this.getInnerHeight() / this.style.contentHeight));
            }
        }
    }

    private doMouseDown(type : string, e : MouseEvent){
        let x = e.pageX;
        let y = e.pageY;
        let opeLine = this["scrollbarOpeLine" + type];
        this.onScrollMDOffset = type === "V" ? y - opeLine.getRealY() : x - opeLine.getRealX();
        this.onScrollObj = opeLine;
    }

    private doMouseMove(e : MouseEvent){
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
                this.setStyle("contentScrollY", (this.style.contentHeight - this.getInnerHeight()) * (setVal / maxVal));
                this.setScrollY();
            }
            else
            {
                setVal = mp - this.scrollbarBaseLineH.getRealX() - this.onScrollMDOffset;
                maxVal = this.scrollbarBaseLineH.getWidth() - this.onScrollObj.getWidth();
                setVal = Math.max(setVal, 0);
                setVal = Math.min(setVal, maxVal);
                this.onScrollObj.setX(setVal);
                this.setStyle("contentScrollX", (this.style.contentWidth - this.getInnerWidth()) * (setVal / maxVal));
                this.setScrollX();
            }
        }
    }

    private doMouseUp(e : MouseEvent){
        this.onScrollObj = undefined;
    }

    private doMouseWheel(e : WheelEvent){
        if (this.style.contentHeight <= this.getInnerHeight())
        {
            return;
        }
        let wheelDelta = e.wheelDelta;
        let wheelVal;
        if (wheelDelta < 0)
        {
            wheelVal = this.style.contentScrollY + 30;
        }
        else
        {
            wheelVal = this.style.contentScrollY - 30;
        }
        wheelVal = Math.min(wheelVal, this.style.contentHeight - this.getInnerHeight());
        wheelVal = Math.max(wheelVal, 0);
        this.setScrollYValue(wheelVal);
    }

    private setScrollYValue(value : number){
        this.setStyle("contentScrollY", value);
        this.setScrollY();
        let scrollObjY = (this.scrollbarBaseLineV.getHeight() - this.scrollbarOpeLineV.getHeight())
            * (value / (this.style.contentHeight - this.getInnerHeight()));
        this.scrollbarOpeLineV.setY(scrollObjY);
    }

    //设置所有子节点的滚动值
    private setScrollX(){
        if (this.style.scrollText)
        {
            this.setStyle("textScrollX", this.style.contentScrollX);
        }
        else
        {
            this.children.forEach((child)=>{
                if (child !== this.scrollbarBaseLineV && child !== this.scrollbarBaseLineH)
                {
                    child.setStyle("scrollX", this.style.contentScrollX);
                }
            });
        }
    }
    private setScrollY(){
        if (this.style.scrollText)
        {
            this.setStyle("textScrollY", this.style.contentScrollY);
        }
        else
        {
            this.children.forEach((child)=>{
                if (child !== this.scrollbarBaseLineV && child !== this.scrollbarBaseLineH)
                {
                    child.setStyle("scrollY", this.style.contentScrollY);
                }
            });
        }
    }

    /** 生成滚动条
     *
     * @param oritation 方向，1：竖向滚动条；2：横向滚动条
     */
    private produceLine(oritation : number, lineColor : string, alpha : number) : Component
    {
        let Rect = require("./rect").default;
        oritation = oritation || 1;
        let padding = 0;
        let swidth = this.style.scrollbarWidth || DEFAULT_SCROLLBAR_WIDTH;
        let radius = this.style.scrollbarRadius || 6;

        let line = new Rect(this);
        line.setX(()=>{
            return oritation === 1 ? this.getInnerWidth() - swidth : padding;
        });
        line.setY(()=>{
            return oritation === 2 ? this.getInnerHeight() - swidth : padding;
        });
        if (oritation === 1)
        {
            line.setWidth(swidth);
            line.setHeight("100%");
        }
        else
        {
            line.setHeight(swidth);
            line.setWidth("100%");
        }
        line.setStyle({
            backgroundColor : lineColor,
            alpha : alpha,
            borderRadius : radius,
            zIndex : 99999
        });
        line.init();
        return line;
    }

    /** 还原滚动条到初始位置 */
    restoreScroll(){
        this.setStyle({
            contentScrollX : 0,
            contentScrollY : 0
        });
        this.scrollbarOpeLineV.setStyle({
            y : 0
        });
        this.scrollbarOpeLineH.setStyle({
            x : 0
        });
        this.setScrollX();
        this.setScrollY();
    }

    protected doLayout(){
        this.restoreScroll();
        super.doLayout();
    }

    destroy() {
        super.destroy();

        globalUtil.viewState.removeEvent("mousemove", this.doMouseMoveBind);
        globalUtil.viewState.removeEvent("mouseup", this.doMouseUpBind);
    }
}