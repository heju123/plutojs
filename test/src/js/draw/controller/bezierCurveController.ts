import {Controller,Component,Point,BezierCurve} from "~/js/main";

export default class BezierCurveController extends Controller{
    private ctrl1Point : Point;
    private ctrl2Point : Point;
    private startPoint : Point;
    private endPoint : Point;
    private dragObj : Point;
    private bezierCurve : BezierCurve;

    constructor(component : Component) {
        super(component);

        this.registerEvent("$onViewLoaded", ()=>{
            this.startPoint = new Point(this.component.getRealX() + 0, this.component.getRealY() + 150);
            this.ctrl1Point = new Point(this.component.getRealX() + 10, this.component.getRealY() + 290);
            this.ctrl2Point = new Point(this.component.getRealX() + 390, this.component.getRealY() + 10);
            this.endPoint = new Point(this.component.getRealX() + 400, this.component.getRealY() + 150);

            this.bezierCurve = new BezierCurve(this.ctrl1Point, this.ctrl2Point, this.endPoint);
        });
    }

    onMousedown(e){
        if (e.pageX >= this.ctrl1Point.x - 5 && e.pageX <= this.ctrl1Point.x + 5
            && e.pageY >= this.ctrl1Point.y - 5 && e.pageY <= this.ctrl1Point.y + 5)
        {
            this.dragObj = this.ctrl1Point;
        }
        if (e.pageX >= this.ctrl2Point.x - 5 && e.pageX <= this.ctrl2Point.x + 5
            && e.pageY >= this.ctrl2Point.y - 5 && e.pageY <= this.ctrl2Point.y + 5)
        {
            this.dragObj = this.ctrl2Point;
        }
    }
    onMousemove(e){
        if (this.dragObj)
        {
            this.dragObj.x = e.pageX;
            this.dragObj.y = e.pageY;
        }
    }
    onMouseup(e){
        this.dragObj = undefined;
    }

    draw(ctx : CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.moveTo(this.startPoint.x, this.startPoint.y);
        this.bezierCurve.draw(ctx);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = "#a3a3a3";
        ctx.arc(this.ctrl1Point.x, this.ctrl1Point.y, 10, 0, 2 * Math.PI);
        ctx.arc(this.ctrl2Point.x, this.ctrl2Point.y, 10, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = "#ff0000";
        ctx.arc(this.ctrl1Point.x, this.ctrl1Point.y, 1, 0, 2 * Math.PI);
        ctx.arc(this.ctrl2Point.x, this.ctrl2Point.y, 1, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }

    destroy(){
        this.physicsQueue.destroy();
    }
}