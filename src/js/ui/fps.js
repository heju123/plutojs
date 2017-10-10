/**
 * Created by heju on 2017/7/13.
 */
import commonUtil from "../util/commonUtil.js";
import globalUtil from "../util/globalUtil.js";
import ViewState from "./viewState.js";
import EventBus from "../event/eventBus.js";

export default class Fps{
    constructor(mainBody){
        this.canvas = document.createElement("CANVAS");
        mainBody.appendChild(this.canvas);
        this.canvas.width = mainBody.offsetWidth;
        this.canvas.height = mainBody.offsetHeight;
        this.ctx = this.canvas.getContext('2d');
        window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

        globalUtil.eventBus = new EventBus(this.canvas);
    }

    setMainView(viewCfg){
        globalUtil.viewState = new ViewState(this.ctx);
        globalUtil.viewState.init(viewCfg);
    }

    /** 开始循环绘制 */
    startLoop(){
        window.requestAnimationFrame(this.draw.bind(this));
    }

    /** 防止children超出 */
    setClip(com)
    {
        if (com.setClip)
        {
            this.ctx.save();
            com.setClip(this.ctx);
        }
    }
    restoreClip(com)
    {
        if (com.setClip)
        {
            this.ctx.restore();
        }
    }

    drawView(com){
        if (!com.active)
        {
            return;
        }
        if (com.draw(this.ctx))
        {
            let children = com.getChildren();
            if (children)
            {
                if (children instanceof Array)
                {
                    children.sort((a, b)=>a.style.zIndex - b.style.zIndex);//zIndex升序排序
                    let child;
                    for (let i = 0, j = children.length; i < j; i++)
                    {
                        this.setClip(com);
                        child = children[i];
                        this.drawView(child);
                        this.restoreClip(com);
                    }
                }
                else
                {
                    this.setClip(com);
                    this.drawView(children);
                    this.restoreClip(com);
                }
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

    draw(){
        //背景
        this.ctx.fillStyle = "#000";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        globalUtil.viewState.beforeDraw(this.ctx);
        this.drawView(globalUtil.viewState.rootComponent);
        globalUtil.viewState.afterDraw(this.ctx);

        window.requestAnimationFrame(this.draw.bind(this));
    }
}