import {Controller,Component,Point,Particle,BaseParticle,Physics,Acceleration,Speed,animationUtil} from "~/js/main";

export default class Particle1 extends BaseParticle implements Particle{
    alpha : number = 1;
    private particleRadius : number = 2;

    constructor(component : Component, lifeTime? : number, opts? : any) {
        super(component, lifeTime);

        var options = opts || {
            x : (<Particle>this).component.getWidth() / 2 - this.particleRadius,
            y : 0
        };

        (<Particle>this).setX(options.x);
        (<Particle>this).setY(options.y);

        (<Particle>this).xSpeed = this.getRanSpeed();
        (<Particle>this).ySpeed = -(Math.random() * 2 + 0.1);

        (<Particle>this).yAcceleration = 0.1;

        let speed : Physics = new Speed(this);
        (<Particle>this).addPhysics(speed);

        let acceleration : Acceleration = new Acceleration(this);
        (<Particle>this).addPhysics(acceleration);
    }

    private getRanSpeed(){
        if (Math.random() > 0.5)
        {
            return Math.random() * 2 + 0.05;
        }
        else
        {
            return -(Math.random() * 2 + 0.05);
        }
    }

    draw(ctx : CanvasRenderingContext2D) : boolean{
        if (!super.draw(ctx))
        {
            return;
        }

        ctx.beginPath();
        ctx.globalAlpha = this.alpha;
        let radialGradient = ctx.createRadialGradient((<Particle>this).getRealX(), (<Particle>this).getRealY(), this.particleRadius / 2,
            (<Particle>this).getRealX(), (<Particle>this).getRealY(), this.particleRadius);
        radialGradient.addColorStop(0, '#6bd3ff');
        radialGradient.addColorStop(1, '#ffffff');
        ctx.fillStyle = radialGradient;

        ctx.arc((<Particle>this).getRealX(), (<Particle>this).getRealY(), this.particleRadius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }

    beforeMount(){
    }
    mounted(){
    }
    beforeDestroy() : Promise<any>{
        return new Promise((resolve, reject)=>{
            resolve();
        });
    }
    destroyed(){
    }
}