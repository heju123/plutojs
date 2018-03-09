import {Controller,Component,Point,BezierCurve} from "~/js/main";

export default class WaveController extends Controller{
    private startPoint : Point;
    private endPoint : Point;
    private startPointYSpeed : number = -0.8;
    private endPointYSpeed : number = -0.8;
    private seMinY : number = 150;
    private seMaxY : number = 250;

    private ctrl1Point : Point;
    private ctrl2Point : Point;
    private ctrlMinY : number = 100;
    private ctrlMaxY : number = 200;
    private ctrl1YSpeed : number = -0.8;
    private ctrl2YSpeed : number = 0.8;
    private bezierCurve : BezierCurve;

    private lastTime : number;
    private lock : boolean = false;

    constructor(component : Component) {
        super(component);

        (<Controller>this).registerEvent("$onViewLoaded", ()=>{
            this.startPoint = new Point(0, 220);
            this.endPoint = new Point(500, 180);

            this.ctrl1Point = new Point(150, 200);
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
                    if (this.startPoint.y <= this.seMinY || this.startPoint.y >= this.seMaxY)
                    {
                        this.startPointYSpeed = -this.startPointYSpeed;
                    }
                    if (this.endPoint.y <= this.seMinY || this.endPoint.y >= this.seMaxY)
                    {
                        this.endPointYSpeed = -this.endPointYSpeed;
                    }

                    this.ctrl1Point.y += this.ctrl1YSpeed;
                    this.ctrl2Point.y += this.ctrl2YSpeed;
                    if (this.ctrl1Point.y <= this.ctrlMinY || this.ctrl1Point.y >= this.ctrlMaxY)
                    {
                        this.ctrl1YSpeed = -this.ctrl1YSpeed;
                    }
                    if (this.ctrl2Point.y <= this.ctrlMinY || this.ctrl2Point.y >= this.ctrlMaxY)
                    {
                        this.ctrl2YSpeed = -this.ctrl2YSpeed;
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