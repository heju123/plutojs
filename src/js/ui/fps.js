/**
 * Created by heju on 2017/7/13.
 */
import commonUtil from "../util/commonUtil.js";
import ViewState from "./viewState.js";
import EventBus from "./event/eventBus.js";

export default class Fps{
    constructor(mainBody){
        this.canvas = document.createElement("CANVAS");
        mainBody.appendChild(this.canvas);
        this.canvas.width = mainBody.offsetWidth;
        this.canvas.height = mainBody.offsetHeight;
        this.ctx = this.canvas.getContext('2d');
        window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

        this.eventBus = new EventBus(this.canvas);
    }

    setMainView(viewCfg){
        this.viewState = new ViewState(viewCfg);
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
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        //背景
        this.ctx.fillStyle = "#000";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawView(this.viewState.rootPanel);

        window.requestAnimationFrame(this.draw.bind(this));
    }
}