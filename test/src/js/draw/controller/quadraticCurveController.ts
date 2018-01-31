import {Controller,Component,Point,QuadraticCurve} from "~/js/main";

export default class QuadraticCurveController extends Controller{
    private ctrlPoint : Point;
    private startPoint : Point;
    private endPoint : Point;
    private dragging : boolean = false;
    private quadraticCurve : QuadraticCurve;

    constructor(component : Component) {
        super(component);

        this.registerEvent("$onViewLoaded", ()=>{
            this.startPoint = new Point(this.component.getRealX() + 0, this.component.getRealY() + 150);
            this.ctrlPoint = new Point(this.component.getRealX() + 200, this.component.getRealY() + 200);
            this.endPoint = new Point(this.component.getRealX() + 400, this.component.getRealY() + 150);

            this.quadraticCurve = new QuadraticCurve(this.ctrlPoint, this.endPoint);
        });
    }

    onMousedown(e){
        this.dragging = true;
    }
    onMousemove(e){
        if (this.dragging)
        {
            this.ctrlPoint.x = e.pageX;
            this.ctrlPoint.y = e.pageY;
        }
    }
    onMouseup(e){
        this.dragging = false;
    }

    draw(ctx : CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.moveTo(this.startPoint.x, this.startPoint.y);
        this.quadraticCurve.draw(ctx);
        ctx.closePath();
    }
}