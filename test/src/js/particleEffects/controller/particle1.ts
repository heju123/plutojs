import {Controller,Component,Point,Particle,BaseParticle,Physics,Acceleration,Speed,animationUtil} from "~/js/main";

export default class Particle1 extends BaseParticle implements Particle{
    alpha : number = 0;
    private particleRadius : number = 4;

    constructor(component : Component, lifeTime? : number) {
        super(component, lifeTime);

        (<Particle>this).setX((<Particle>this).component.getWidth() / 2 - this.particleRadius);
        (<Particle>this).setY((<Particle>this).component.getHeight() / 2 - this.particleRadius);

        (<Particle>this).ySpeed = this.getRanSpeed();
        (<Particle>this).xSpeed = this.getRanSpeed();

        let speed : Physics = new Speed(this);
        (<Particle>this).addPhysics(speed);
    }

    private getRanSpeed(){
        if (Math.random() > 0.5)
        {
            return Math.random() * 0.5 + 0.05;
        }
        else
        {
            return -(Math.random() * 0.5 + 0.05);
        }
    }

    draw(ctx : CanvasRenderingContext2D){
        ctx.beginPath();
        ctx.globalAlpha = this.alpha;
        var radialGradient = ctx.createRadialGradient((<Particle>this).getRealX(), (<Particle>this).getRealY(), this.particleRadius / 2,
            (<Particle>this).getRealX(), (<Particle>this).getRealY(), this.particleRadius);
        radialGradient.addColorStop(0, '#ff6172');
        radialGradient.addColorStop(1, '#ffffff');
        ctx.fillStyle = radialGradient;

        ctx.arc((<Particle>this).getRealX(), (<Particle>this).getRealY(), this.particleRadius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }

    beforeMount(){
    }
    mounted(){
        animationUtil.executeAttrChange(this, {alpha : 1}, {
            duration : "1s",
            onComplete : function(){
            },
            easeType : "Linear",
            easing : "ease"
        });
    }
    beforeDestroy() : Promise<any>{
        return new Promise((resolve, reject)=>{
            animationUtil.executeAttrChange(this, {alpha : 0}, {
                duration : "2s",
                onComplete : function(){
                    resolve();
                },
                easeType : "Linear",
                easing : "ease"
            });
        });
    }
    destroyed(){
    }
}