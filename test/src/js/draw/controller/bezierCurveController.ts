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

        (<Controller>this).registerEvent("$onViewLoaded", ()=>{
            this.startPoint = new Point(0, 40);
            this.ctrl1Point = new Point(10, 290);
            this.ctrl2Point = new Point(390, 10);
            this.endPoint = new Point(400, 220);

            this.bezierCurve = new BezierCurve((<Controller>this).component, this.ctrl1Point, this.ctrl2Point, this.endPoint);
        });
    }

    onMousedown(e){
        if (e.pageX >= (<Controller>this).getDrawX(this.ctrl1Point.x) - 5 && e.pageX <= (<Controller>this).getDrawX(this.ctrl1Point.x) + 5
            && e.pageY >= (<Controller>this).getDrawY(this.ctrl1Point.y) - 5 && e.pageY <= (<Controller>this).getDrawY(this.ctrl1Point.y) + 5)
        {
            this.dragObj = this.ctrl1Point;
        }
        if (e.pageX >= (<Controller>this).getDrawX(this.ctrl2Point.x) - 5 && e.pageX <= (<Controller>this).getDrawX(this.ctrl2Point.x) + 5
            && e.pageY >= (<Controller>this).getDrawY(this.ctrl2Point.y) - 5 && e.pageY <= (<Controller>this).getDrawY(this.ctrl2Point.y) + 5)
        {
            this.dragObj = this.ctrl2Point;
        }
    }
    onMousemove(e){
        if (this.dragObj)
        {
            this.dragObj.x = (<Controller>this).getRelativeX(e.pageX);
            this.dragObj.y = (<Controller>this).getRelativeY(e.pageY);
        }
    }
    onMouseup(e){
        this.dragObj = undefined;
    }

    draw(ctx : CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.moveTo((<Controller>this).getDrawX(this.startPoint.x), (<Controller>this).getDrawY(this.startPoint.y));
        this.bezierCurve.draw(ctx);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = "#a3a3a3";
        ctx.arc((<Controller>this).getDrawX(this.ctrl1Point.x), (<Controller>this).getDrawY(this.ctrl1Point.y), 10, 0, 2 * Math.PI);
        ctx.arc((<Controller>this).getDrawX(this.ctrl2Point.x), (<Controller>this).getDrawY(this.ctrl2Point.y), 10, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = "#ff0000";
        ctx.arc((<Controller>this).getDrawX(this.ctrl1Point.x), (<Controller>this).getDrawY(this.ctrl1Point.y), 1, 0, 2 * Math.PI);
        ctx.arc((<Controller>this).getDrawX(this.ctrl2Point.x), (<Controller>this).getDrawY(this.ctrl2Point.y), 1, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }

    destroy(){
    }
}