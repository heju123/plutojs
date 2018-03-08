import {Controller,Component,Point,QuadraticCurve,PhysicsQueue,Friction,Acceleration,Physics} from "~/js/main";

export default class QuadraticCurveController extends Controller{
    private ctrlPoint : Point;
    private startPoint : Point;
    private endPoint : Point;
    private dragging : boolean = false;
    private quadraticCurve : QuadraticCurve;
    private lock : boolean = false;

    private centerPoint : Point;
    private xSpeed : number = 0;
    private ySpeed : number = 0;
    private xAcceleration : number = 0;
    private yAcceleration : number = 0;
    private physicsQueue : PhysicsQueue = new PhysicsQueue(this);
    private lastTime : number;

    constructor(component : Component) {
        super(component);

        (<Controller>this).registerEvent("$onViewLoaded", ()=>{
            this.startPoint = new Point(0, 150);
            this.ctrlPoint = new Point(200, 200);
            this.endPoint = new Point(400, 150);

            this.quadraticCurve = new QuadraticCurve((<Controller>this).component, this.ctrlPoint, this.endPoint);
            this.centerPoint = new Point(200, 150);
        });

        let acceleration : Physics = new Acceleration(this);
        let xfriction : Physics = new Friction(this, "x", 0.2);
        let yfriction : Physics = new Friction(this, "y", 0.1);
        this.physicsQueue.add(acceleration);
        this.physicsQueue.add(xfriction);
        this.physicsQueue.add(yfriction);
    }

    onMousedown(e){
        this.dragging = true;
    }
    onMousemove(e){
        if (this.dragging)
        {
            this.ctrlPoint.x = (<Controller>this).getX(e.pageX);
            this.ctrlPoint.y = (<Controller>this).getY(e.pageY);
        }
    }
    onMouseup(e){
        this.dragging = false;
    }

    draw(ctx : CanvasRenderingContext2D) {
        let currentTime = (new Date()).getTime();
        if (!this.lastTime) {
            this.lastTime = currentTime;
        }
        else {
            if (currentTime - this.lastTime >= 1)//大约1毫秒执行一次
            {
                if (this.dragging === false && !this.lock)
                {
                    this.lock = true;
                    this.xAcceleration = (this.centerPoint.x - this.ctrlPoint.x) * 0.01;
                    this.yAcceleration = (this.centerPoint.y - this.ctrlPoint.y) * 0.1;
                    this.physicsQueue.doEffect().then(()=>{
                        if (this.xSpeed !== 0)
                        {
                            this.ctrlPoint.x = this.ctrlPoint.x + this.xSpeed;
                        }
                        if (this.ySpeed !== 0)
                        {
                            this.ctrlPoint.y = this.ctrlPoint.y + this.ySpeed;
                        }
                        this.lock = false;
                    });
                }
                this.lastTime = currentTime;
            }
        }

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.moveTo((<Controller>this).getDrawX(this.startPoint.x), (<Controller>this).getDrawY(this.startPoint.y));
        this.quadraticCurve.draw(ctx);
        ctx.stroke();
        ctx.closePath();
    }

    destroy(){
        this.physicsQueue.destroy();
    }
}