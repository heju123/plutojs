import Component from "../../ui/components/component";

export default class BaseParticle{
    x : number = 0;
    y : number = 0;
    xSpeed : number = 0;
    ySpeed : number = 0;
    xAcceleration : number = 0;
    yAcceleration : number = 0;

    component : Component;

    alive : boolean = true;

    lifeTime : number = -1;

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

    draw(ctx : CanvasRenderingContext2D) : boolean{
        let currentTime = (new Date()).getTime();
        if (!this.lastTime) {
            this.lastTime = currentTime;
        }
        else {
            if (currentTime - this.lastTime >= 1)//大约1毫秒执行一次
            {
                this.lock = true;

                this.lock = false;
                this.lastTime = currentTime;
            }
        }
        return true;
    }
}