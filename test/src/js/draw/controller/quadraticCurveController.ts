import {Controller,Component,Point,QuadraticCurve} from "~/js/main";

export default class QuadraticCurveController extends Controller{
    private ctrlPoint : Point;
    private startPoint : Point;
    private endPoint : Point;
    private dragPoint : Point;

    constructor(component : Component) {
        super(component);

        this.registerEvent("$onViewLoaded", ()=>{
            this.startPoint = new Point(this.component.getRealX() + 0, this.component.getRealY() + 150);
            this.ctrlPoint = new Point(this.component.getRealX() + 200, this.component.getRealY() + 200);
            this.endPoint = new Point(this.component.getRealX() + 400, this.component.getRealY() + 150);
        });

        this.component.registerEvent("mousedown", (e)=>{
            this.dragPoint = new Point(e.pageX, e.pageY);
        });
        this.component.registerEvent("mousemove", (e)=>{
            if (this.dragPoint)
            {
                this.dragPoint.x = e.pageX;
                this.dragPoint.y = e.pageY;
                this.ctrlPoint = this.dragPoint;
            }
        });
        this.component.registerEvent("mouseup", (e)=>{
            this.dragPoint = undefined;
        });
    }

    draw(ctx : CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.moveTo(this.startPoint.x, this.startPoint.y);
        let quadraticCurve : QuadraticCurve = new QuadraticCurve(this.ctrlPoint, this.endPoint);
        quadraticCurve.draw(ctx);
        ctx.closePath();
    }
}