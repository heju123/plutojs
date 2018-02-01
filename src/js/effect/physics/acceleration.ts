import Physics from "./physics";
import BasePhysics from "./basePhysics";

/** 加速度 */
export default class Acceleration extends BasePhysics implements Physics{
    private effectedAttr : string;//受影响的属性
    private acceleration : number;//加速度

    constructor(effectedAttr, acceleration){
        super();
        this.effectedAttr = effectedAttr;
        this.acceleration = acceleration;
    }

    effect() : Promise<any> {
        return new Promise((resolve, reject)=>{
            super.effect().then(()=>{
                if (this.acceleration !== 0)
                {
                    this.target[this.effectedAttr] = this.target[this.effectedAttr] + this.acceleration;
                }
                resolve();
            }, (data)=>{
                reject(data);
            });
        });
    }
}