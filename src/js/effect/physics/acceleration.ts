import Physics from "./physics";
import BasePhysics from "./basePhysics";

/** 加速度 */
export default class Acceleration extends BasePhysics implements Physics{
    constructor(target : any){
        super(target);
    }

    effect() : Promise<any> {
        return new Promise((resolve, reject)=>{
            super.effect().then(()=>{
                if (this.target.xAcceleration !== 0)
                {
                    this.target.xSpeed = this.target.xSpeed + this.target.xAcceleration;
                }
                if (this.target.yAcceleration !== 0)
                {
                    this.target.ySpeed = this.target.ySpeed + this.target.yAcceleration;
                }
                resolve();
            }, (data)=>{
                reject(data);
            });
        });
    }

    destroy() {
        super.destroy();
    }
}