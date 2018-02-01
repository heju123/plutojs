import Physics from "./physics";
import BasePhysics from "./basePhysics";

/** 摩擦力 */
export default class Friction extends BasePhysics implements Physics{
    friction : number;//摩擦力数值
    private effectedAttr : string;//受影响的属性

    constructor(effectedAttr, friction){
        super();
        this.effectedAttr = effectedAttr;
        this.friction = friction;
    }

    effect() : Promise<any> {
        return new Promise((resolve, reject)=>{
            super.effect().then(()=>{
                if (this.target[this.effectedAttr] > 0)
                {
                    this.target[this.effectedAttr] -= this.friction;
                    this.target[this.effectedAttr] = Math.max(this.target[this.effectedAttr], 0);
                }
                else if (this.target[this.effectedAttr] < 0)
                {
                    this.target[this.effectedAttr] += this.friction;
                    this.target[this.effectedAttr] = Math.min(this.target[this.effectedAttr], 0);
                }
                resolve();
            }, (data)=>{
                reject(data);
            });
        });
    }
}