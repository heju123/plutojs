import {Controller,Component,Point,BezierCurve} from "~/js/main";

export default class WaveController extends Controller{
    private startPoint : Point;
    private endPoint : Point;

    constructor(component : Component) {
        super(component);

        (<Controller>this).registerEvent("$onViewLoaded", ()=>{
            this.startPoint = new Point(0, 150);
            this.endPoint = new Point(500, 150);
        });
    }

    draw(ctx : CanvasRenderingContext2D) {
        ctx.fillStyle = "#77b8ff";
        ctx.beginPath();
        //水面
        ctx.moveTo((<Controller>this).getDrawX(this.startPoint.x), (<Controller>this).getDrawY(this.startPoint.y));
        ctx.lineTo((<Controller>this).getDrawX(this.endPoint.x), (<Controller>this).getDrawY(this.endPoint.y));

        //水体
        ctx.lineTo((<Controller>this).component.getRealX() + (<Controller>this).component.getWidth(),
            (<Controller>this).component.getRealY() + (<Controller>this).component.getHeight());
        ctx.lineTo((<Controller>this).component.getRealX(),
            (<Controller>this).component.getRealY() + (<Controller>this).component.getHeight());
        ctx.lineTo((<Controller>this).getDrawX(this.startPoint.x), (<Controller>this).getDrawY(this.startPoint.y));

        ctx.fill();
        ctx.closePath();
    }
}