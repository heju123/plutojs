/**
 * Created by heju on 2017/7/13.
 */
import commonUtil from "../util/commonUtil.js";
import ViewState from "./viewState.js";

export default class Fps{
    constructor(mainBody){
        this.canvas = document.createElement("CANVAS");
        mainBody.appendChild(this.canvas);
        this.canvas.width = mainBody.offsetWidth;
        this.canvas.height = mainBody.offsetHeight;
        this.ctx = this.canvas.getContext('2d');
        window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    }

    setMainView(view){
        this.viewState = new ViewState(view);
    }

    /** 开始循环绘制 */
    startLoop(){
        window.requestAnimationFrame(this.draw.bind(this));
    }

    drawView(state){
        let view;
        for (let i = 0, j = state.views.length; i < j; i++)
        {
            view = state.views[i];
            switch (view.type)
            {
                case "panel" :
                    this.ctx.fillStyle = view.style.backgroundColor;
                    this.ctx.fillRect(view.style.x, view.style.y, view.style.width, view.style.height);
                    break;
                default : break;
            }
        }
    }

    draw(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        //背景
        this.ctx.fillStyle = "#000";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawView(this.viewState.view);

        window.requestAnimationFrame(this.draw.bind(this));
    }
}