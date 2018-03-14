import {Controller,Component,Point,Particle,BaseParticle} from "~/js/main";

export default class Particle1 extends BaseParticle implements Particle{
    constructor(component : Component, lifeTime? : number) {
        super(component, lifeTime);
    }

    draw(ctx : CanvasRenderingContext2D) : boolean{
        if (!super.draw(ctx))
        {
            return;
        }

        ctx.beginPath();
        ctx.fillStyle = "#ff0000";
        ctx.fillRect(this.component.getRealX() + 10, this.component.getRealY() + 10, 50, 50);
        ctx.closePath();
    }
}