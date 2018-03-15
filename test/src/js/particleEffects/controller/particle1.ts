import {Controller,Component,Point,Particle,BaseParticle,Physics,Acceleration,Speed} from "~/js/main";

export default class Particle1 extends BaseParticle implements Particle{
    constructor(component : Component, lifeTime? : number) {
        super(component, lifeTime);

        (<Particle>this).yAcceleration = 0.05;
        let speed : Physics = new Speed(this);
        let acceleration : Physics = new Acceleration(this);
        (<Particle>this).addPhysics(acceleration);
        (<Particle>this).addPhysics(speed);
    }

    draw(ctx : CanvasRenderingContext2D) : boolean{
        if (!super.draw(ctx))
        {
            return;
        }

        ctx.beginPath();
        ctx.fillStyle = "#ff0000";
        ctx.fillRect((<Particle>this).getRealX(), (<Particle>this).getRealY(), 50, 50);
        ctx.closePath();
    }

    beforeMount(){
    }
    mounted(){
    }
    beforeDestroy(){
    }
    destroyed(){
    }
}