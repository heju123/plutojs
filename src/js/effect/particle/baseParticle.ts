import Component from "../../ui/components/component";
import PhysicsQueue from "../physics/physicsQueue";
import Physics from "../physics/physics";

export default abstract class BaseParticle{
    x : number = 0;
    y : number = 0;
    xSpeed : number = 0;
    ySpeed : number = 0;
    xAcceleration : number = 0;
    yAcceleration : number = 0;

    component : Component;

    alive : boolean = true;
    isDestroying = false;//是否正在销毁，为了避免延迟情况下重复调用销毁方法

    lifeTime : number = -1;

    private physicsQueue : PhysicsQueue = new PhysicsQueue(this);

    private lastTime : number;
    private lock : boolean = false;

    constructor(component : Component, lifeTime? : number){
        this.component = component;

        if (lifeTime)
        {
           this.lifeTime = lifeTime;
        }
        if (this.lifeTime !== -1)
        {
            setTimeout(()=>{
                this.alive = false;
            }, this.lifeTime);
        }
    }

    readyToDraw(ctx : CanvasRenderingContext2D){
        this.physicsQueue.effect();
        ctx.save();
        this.draw(ctx);
        ctx.restore();
    }

    abstract draw(ctx : CanvasRenderingContext2D);

    /** 添加物理现象 */
    addPhysics(physics : Physics){
        this.physicsQueue.add(physics);
    }

    setX(x : number){
        this.x = x;
    }
    setY(y : number){
        this.y = y;
    }
    getX() : number{
        return this.x;
    }
    getY() : number{
        return this.y;
    }
    getRealX() : number{
        return this.component.getRealX() + this.getX();
    }
    getRealY() : number{
        return this.component.getRealY() + this.getY();
    }
}