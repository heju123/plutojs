import {Controller,Component,Point,BezierCurve,PhysicsQueue,Physics,Acceleration} from "~/js/main";

export default class WaveController extends Controller{
    private centerPoint : Point = new Point(250, 200);
    private startPoint : Point;
    private endPoint : Point;
    private sPPhysics : any = {
        xAcceleration : 0,
        yAcceleration : 0,
        xSpeed : 0,
        ySpeed : 0
    };
    private ePPhysics : any = {
        xAcceleration : 0,
        yAcceleration : 0,
        xSpeed : 0,
        ySpeed : 0
    };

    private physicsQueue : PhysicsQueue = new PhysicsQueue(this);

    private ctrl1Point : Point;
    private ctrl2Point : Point;
    private bezierCurve : BezierCurve;

    private lastTime : number;
    private lock : boolean = false;

    constructor(component : Component) {
        super(component);

        (<Controller>this).registerEvent("$onViewLoaded", ()=>{
            this.startPoint = new Point(0, 240);
            this.endPoint = new Point(500, 240);

            this.ctrl1Point = new Point(230, 240);
            this.ctrl2Point = new Point(270, 240);
            this.bezierCurve = new BezierCurve((<Controller>this).component, this.ctrl1Point, this.ctrl2Point, this.endPoint);
        });

        let sAcceleration : Physics = new Acceleration(this.sPPhysics);
        sAcceleration.delay = 800;
        let eAcceleration : Physics = new Acceleration(this.ePPhysics);
        this.physicsQueue.add(sAcceleration);
        this.physicsQueue.add(eAcceleration);
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

                    this.sPPhysics.yAcceleration = (this.centerPoint.y - this.startPoint.y) * 0.001;
                    this.ePPhysics.yAcceleration = (this.centerPoint.y - this.endPoint.y) * 0.001;
                    this.physicsQueue.doEffect().then(()=>{
                        if (this.sPPhysics.ySpeed !== 0)
                        {
                            this.startPoint.y = this.startPoint.y + this.sPPhysics.ySpeed;
                            this.ctrl1Point.y = this.startPoint.y - (this.centerPoint.y * 2 - this.startPoint.y) * 0.2;
                        }
                        if (this.ePPhysics.ySpeed !== 0)
                        {
                            this.endPoint.y = this.endPoint.y + this.ePPhysics.ySpeed;
                            this.ctrl2Point.y = this.endPoint.y - (this.centerPoint.y * 2 - this.endPoint.y) * 0.2;
                        }
                        this.lock = false;
                    });
                }
                this.lastTime = currentTime;
            }
        }

        ctx.fillStyle = "#8ab9ff";
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