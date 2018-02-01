import Physics from "./physics";
import BasePhysics from "./basePhysics";

/** 摩擦力 */
export default class Friction extends BasePhysics implements Physics{
    private friction : number;//摩擦力数值
    private direction : string;//方向，x：x方向；y：y方向；xy：同时

    constructor(target : any, direction : string, friction : number){
        super(target);
        this.direction = direction;
        this.friction = friction;
    }

    effect() : Promise<any> {
        return new Promise((resolve, reject)=>{
            super.effect().then(()=>{
                if (this.direction.indexOf("x") > -1)
                {
                    if (this.target.xSpeed > 0)
                    {
                        this.target.xSpeed -= this.friction;
                        this.target.xSpeed = Math.max(this.target.xSpeed, 0);
                    }
                    else if (this.target.xSpeed < 0)
                    {
                        this.target.xSpeed += this.friction;
                        this.target.xSpeed = Math.min(this.target.xSpeed, 0);
                    }
                }
                if (this.direction.indexOf("y") > -1)
                {
                    if (this.target.ySpeed > 0)
                    {
                        this.target.ySpeed -= this.friction;
                        this.target.ySpeed = Math.max(this.target.ySpeed, 0);
                    }
                    else if (this.target.ySpeed < 0)
                    {
                        this.target.ySpeed += this.friction;
                        this.target.ySpeed = Math.min(this.target.ySpeed, 0);
                    }
                }
                resolve();
            }, (data)=>{
                reject(data);
            });
        });
    }

    destroy(){
        super.destroy();
    }
}