/**
 * Created by heju on 2017/7/13.
 */
import commonUtil from "../util/commonUtil.js";
import globalUtil from "../util/globalUtil.js";
import ViewState from "./viewState.js";
import EventBus from "../event/eventBus.js";

export default class Fps{
    constructor(mainBody){
        globalUtil.canvas = document.createElement("CANVAS");
        mainBody.appendChild(globalUtil.canvas);
        globalUtil.canvas.width = mainBody.offsetWidth;
        globalUtil.canvas.height = mainBody.offsetHeight;
        this.ctx = globalUtil.canvas.getContext('2d');
        window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

        globalUtil.eventBus = new EventBus(globalUtil.canvas);
    }

    setMainView(viewCfg){
        globalUtil.viewState = new ViewState();
        globalUtil.viewState.init(viewCfg);
    }

    /** 开始循环绘制 */
    startLoop(){
        window.requestAnimationFrame(this.draw.bind(this));
    }

    drawView(com){
        com.draw(this.ctx);
        if (com.children)
        {
            let children;
            for (let i = 0, j = com.children.length; i < j; i++) {
                children = com.children[i];
                this.drawView(children);
            }
        }
    }

    draw(){
        //通知触发事件
        globalUtil.eventBus.doNotifyEvent();

        this.ctx.clearRect(0, 0, globalUtil.canvas.width, globalUtil.canvas.height);

        //背景
        this.ctx.fillStyle = "#000";
        this.ctx.fillRect(0, 0, globalUtil.canvas.width, globalUtil.canvas.height);

        this.drawView(globalUtil.viewState.rootPanel);

        globalUtil.eventBus.propagationEvent();

        window.requestAnimationFrame(this.draw.bind(this));
    }
}