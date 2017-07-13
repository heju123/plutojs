/**
 * Created by heju on 2017/7/13.
 */
export default class Fps{
    constructor(mainBody){
        this.canvas = document.createElement("CANVAS");
        mainBody.appendChild(this.canvas);
        this.canvas.width = mainBody.offsetWidth;
        this.canvas.height = mainBody.offsetHeight;
        this.ctx = this.canvas.getContext('2d');
        window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    }

    /** 开始循环绘制 */
    startLoop(){
        window.requestAnimationFrame(this.draw.bind(this));
    }

    draw(){
        this.ctx.strokeStyle = "#000";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        window.requestAnimationFrame(this.draw.bind(this));
    }
}