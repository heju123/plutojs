import Component from "../../ui/components/component";
import PhysicsQueue from "../physics/physicsQueue";
import Physics from "../physics/physics";
import Cache from "../../cache/cache";

export default abstract class BaseParticle{
    alpha : number = 1;
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

    cache : Cache;

    constructor(component : Component, lifeTime? : number, cache? : Cache){
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

        if (cache)
        {
            this.cache = cache;
        }
    }

    drawParticle(ctx : CanvasRenderingContext2D){
        this.physicsQueue.effect();
        ctx.save();
        if (ctx.globalAlpha !== this.alpha)
        {
            ctx.globalAlpha = this.alpha;
        }
        if (this.cache)
        {
            if (this.cache.isEmpty)
            {
                this.draw(this.cache.getContext());
                this.cache.isEmpty = false;
            }
            ctx.drawImage(this.cache.getCache(), this.getRealX(), this.getRealY());
        }
        else
        {
            this.draw(ctx);
        }
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