import {Controller,Component,Point,BezierCurve} from "~/js/main";

export default class WaveController extends Controller{
    private startPoint : Point;
    private endPoint : Point;
    private startPointYSpeed : number = -0.8;
    private endPointYSpeed : number = -0.8;
    private minY : number = 140;
    private maxY : number = 230;

    private ctrl1Point : Point;
    private ctrl2Point : Point;
    private bezierCurve : BezierCurve;

    private lastTime : number;
    private lock : boolean = false;

    constructor(component : Component) {
        super(component);

        (<Controller>this).registerEvent("$onViewLoaded", ()=>{
            this.startPoint = new Point(0, 150);
            this.endPoint = new Point(500, 200);

            this.ctrl1Point = new Point(150, 300);
            this.ctrl2Point = new Point(350, 100);
            this.bezierCurve = new BezierCurve((<Controller>this).component, this.ctrl1Point, this.ctrl2Point, this.endPoint);
        });
    }

    draw(ctx : CanvasRenderingContext2D) {
        let currentTime = (new Date()).getTime();
        if (!this.lastTime) {
            this.lastTime = currentTime;
        }
        else {
            if (currentTime - this.lastTime >= 1)//大约1毫秒执行一次
            {
                if (!this.lock)
                {
                    this.lock = true;

                    this.startPoint.y += this.startPointYSpeed;
                    this.endPoint.y += this.endPointYSpeed;
                    if (this.startPoint.y <= this.minY || this.startPoint.y >= this.maxY)
                    {
                        this.startPointYSpeed = -this.startPointYSpeed;
                    }
                    if (this.endPoint.y <= this.minY || this.endPoint.y >= this.maxY)
                    {
                        this.endPointYSpeed = -this.endPointYSpeed;
                    }

                    this.lock = false;
                }
                this.lastTime = currentTime;
            }
        }

        ctx.fillStyle = "#77b8ff";
        ctx.beginPath();
        //水面
        ctx.moveTo((<Controller>this).getDrawX(this.startPoint.x), (<Controller>this).getDrawY(this.startPoint.y));
        //ctx.lineTo((<Controller>this).getDrawX(this.endPoint.x), (<Controller>this).getDrawY(this.endPoint.y));
        this.bezierCurve.draw(ctx);

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