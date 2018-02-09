/**
 * Created by heju on 2017/7/13.
 */
import commonUtil from "../util/commonUtil";
import globalUtil from "../util/globalUtil";
import ViewState from "./viewState";
import EventBus from "../event/eventBus";
import Component from "./components/component";

export default class Fps{
    canvas : HTMLCanvasElement;
    ctx : CanvasRenderingContext2D;
    viewState : ViewState;

    constructor(mainBody:HTMLDivElement){
        let outerDiv : HTMLElement = <HTMLCanvasElement>document.createElement("DIV");
        outerDiv.style.width = "100%";
        outerDiv.style.height = "100%";
        outerDiv.style.position = "relative";
        this.canvas = <HTMLCanvasElement>document.createElement("CANVAS");
        (<any>this.canvas).offset = this.offset.bind(this.canvas);
        this.canvas.width = mainBody.offsetWidth;
        this.canvas.height = mainBody.offsetHeight;
        this.canvas.style.position = "absolute";
        this.canvas.ondragstart = function(e){
            e.preventDefault();
        };
        this.canvas.ondragover = function(e){
            e.preventDefault();
        };
        outerDiv.appendChild(this.canvas);
        mainBody.appendChild(outerDiv);
        this.ctx = this.canvas.getContext('2d');
        (<any>this).ctx.canvasOffset = this.offset(this.canvas);
        window.requestAnimationFrame = window.requestAnimationFrame || (<any>window).mozRequestAnimationFrame || (<any>window).webkitRequestAnimationFrame || (<any>window).msRequestAnimationFrame;

        globalUtil.eventBus = new EventBus(this.canvas);
    }

    offset(element:any) {
        element = element || this;

        let offest = {
            top: 0,
            left: 0
        };
        let _position;
        getOffset(element, true);
        return offest;
        // 递归获取 offset, 可以考虑使用 getBoundingClientRect
        function getOffset(node:Node, init?:boolean) {
            // 非Element 终止递归
            if (node.nodeType !== 1) {
                return;
            }
            _position = window.getComputedStyle(<Element>node)['position'];
            // position=static: 继续递归父节点
            if (typeof(init) === 'undefined' && _position === 'static') {
                getOffset(node.parentNode);
                return;
            }
            offest.top = (<HTMLElement>node).offsetTop + offest.top - (node.parentNode ? (<HTMLElement>node.parentNode).scrollTop : 0);
            offest.left = (<HTMLElement>node).offsetLeft + offest.left - (node.parentNode ? (<HTMLElement>node.parentNode).scrollLeft : 0);
            // position = fixed: 获取值后退出递归
            if (_position === 'fixed') {
                return;
            }
            getOffset(node.parentNode);
        }
    }

    setMainView(viewCfg : any){
        this.viewState = new ViewState(this.canvas, this.ctx);
        globalUtil.viewState = this.viewState;
        globalUtil.viewState.init(viewCfg);
    }

    /** 开始循环绘制 */
    startLoop(){
        window.requestAnimationFrame(this.draw.bind(this));
    }

    /** 绘制子组件之前调用 */
    private beforeDrawChildren(com : Component)
    {
        this.ctx.save();
        /** 防止children超出 */
        if ((<any>com).setClip)
        {
            com.isDoingParentClip = true;//是否作为parent执行clip
            (<any>com).setClip(this.ctx);
        }
    }
    private afterDrawChildren(com : Component)
    {
        if ((<any>com).setClip)
        {
            com.isDoingParentClip = false;
        }
        this.ctx.restore();
    }

    private drawView(com : Component){
        if (!com.active)
        {
            return;
        }
        if (com.draw(this.ctx))
        {
            //自定义绘制，在children之前执行
            if (com.controller && com.controller.drawBefore && typeof(com.controller.drawBefore) === "function")
            {
                this.ctx.save();
                com.controller.drawBefore.apply(com.controller, [this.ctx]);
                this.ctx.restore();
            }

            let children = com.getChildren();
            if (children)
            {
                this.beforeDrawChildren(com);
                if (children instanceof Array)
                {
                    if (!com.isSort)
                    {
                        children.sort((a, b)=>a.style.zIndex - b.style.zIndex);//zIndex升序排序
                        com.isSort = true;
                    }
                    let child;
                    for (let i = 0, j = children.length; i < j; i++)
                    {
                        child = children[i];
                        this.drawView(child);
                    }
                }
                else
                {
                    this.drawView(children);
                }
                this.afterDrawChildren(com);
            }

            //自定义绘制
            if (com.controller && com.controller.draw && typeof(com.controller.draw) === "function")
            {
                this.ctx.save();
                com.controller.draw.apply(com.controller, [this.ctx]);
                this.ctx.restore();
            }
        }
    }

    private draw(){
        //背景
        this.ctx.fillStyle = "#000";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        globalUtil.viewState.beforeDraw(this.ctx);
        this.drawView(globalUtil.viewState.rootComponent);
        globalUtil.viewState.afterDraw(this.ctx);

        window.requestAnimationFrame(this.draw.bind(this));
    }
}