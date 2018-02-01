import Physics from "./physics";
import BasePhysics from "./basePhysics";

/** 速度 */
export default class Speed extends BasePhysics implements Physics{
    constructor(){
        super();
    }

    effect() : Promise<any> {
        return new Promise((resolve, reject)=>{
            super.effect().then(()=>{
                if (this.target.xSpeed && this.target.xSpeed !== 0)
                {
                    this.target.setStyle("x", this.getX() + this.target.xSpeed);
                }
                if (this.target.ySpeed && this.target.ySpeed !== 0)
                {
                    this.target.setStyle("y", this.getY() + this.target.ySpeed);
                }
                resolve();
            }, (data)=>{
                if (data.name === "collision")//发生碰撞
                {
                    if (data.direction === "x")
                    {
                        this.target.xSpeed = 0;
                    }
                    else if (data.direction === "y")
                    {
                        this.target.ySpeed = 0;
                    }
                }
                reject(data);
            });
        });
    }
}