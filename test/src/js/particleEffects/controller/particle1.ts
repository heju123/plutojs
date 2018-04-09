import {Controller,Component,Point,Particle,BaseParticle,Physics,Acceleration,Speed,animationUtil,Cache} from "~/js/main";

export default class Particle1 extends BaseParticle implements Particle{
    private particleRadius : number = 4;

    constructor(component : Component, lifeTime? : number, cache? : Cache) {
        super(component, lifeTime, cache);

        (<Particle>this).setX((<Particle>this).component.getWidth() / 2 - this.particleRadius);
        (<Particle>this).setY((<Particle>this).component.getHeight() / 2 - this.particleRadius);

        (<Particle>this).ySpeed = this.getRanSpeed();
        (<Particle>this).xSpeed = this.getRanSpeed();

        let speed : Physics = new Speed(this);
        (<Particle>this).addPhysics(speed);

        (<Particle>this).alpha = 0;
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
        var radialGradient = ctx.createRadialGradient(this.particleRadius, this.particleRadius, this.particleRadius / 2,
            this.particleRadius, this.particleRadius, this.particleRadius);
        radialGradient.addColorStop(0, '#ff6172');
        radialGradient.addColorStop(1, '#ffffff');
        ctx.fillStyle = radialGradient;

        ctx.arc(this.particleRadius, this.particleRadius, this.particleRadius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }

    beforeMount(){
    }
    mounted(){
        animationUtil.executeAttrChange(this, {alpha : 1}, {
            duration : "1s",
            easeType : "Linear",
            easing : "ease"
        }).then(()=>{
        });
    }
    beforeDestroy() : Promise<any>{
        return new Promise((resolve, reject)=>{
            animationUtil.executeAttrChange(this, {alpha : 0}, {
                duration : "2s",
                easeType : "Linear",
                easing : "ease"
            }).then(()=>{
                resolve();
            });
        });
    }
    destroyed(){
    }
}