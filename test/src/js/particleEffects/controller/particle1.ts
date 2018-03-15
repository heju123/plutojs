import {Controller,Component,Point,Particle,BaseParticle,Physics,Acceleration,Speed} from "~/js/main";

export default class Particle1 extends BaseParticle implements Particle{
    constructor(component : Component, lifeTime? : number) {
        super(component, lifeTime);

        (<Particle>this).setX((<Particle>this).component.getWidth() / 2);
        (<Particle>this).setY((<Particle>this).component.getHeight() / 2);

        (<Particle>this).ySpeed = this.getRanSpeed();
        (<Particle>this).xSpeed = this.getRanSpeed();

        let speed : Physics = new Speed(this);
        (<Particle>this).addPhysics(speed);
    }

    private getRanSpeed(){
        if (Math.random() >= 0.5)
        {
            return Math.random() * 0.3 + 0.1;
        }
        else
        {
            return -Math.random() * 0.3 + 0.1;
        }
    }

    draw(ctx : CanvasRenderingContext2D) : boolean{
        if (!super.draw(ctx))
        {
            return;
        }

        ctx.beginPath();
        var radialGradient = ctx.createRadialGradient((<Particle>this).getRealX(), (<Particle>this).getRealY(), 3,
            (<Particle>this).getRealX(), (<Particle>this).getRealY(), 10);
        radialGradient.addColorStop(0, '#ff6a42');
        radialGradient.addColorStop(1, '#ffffff');
        ctx.fillStyle = radialGradient;

        ctx.arc((<Particle>this).getRealX(), (<Particle>this).getRealY(), 10, 0, 2 * Math.PI);
        ctx.fill();
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