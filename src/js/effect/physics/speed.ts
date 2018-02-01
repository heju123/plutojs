import Physics from "./physics";
import BasePhysics from "./basePhysics";
import CollisionReject from "./effectReject/collisionReject";

/** 速度 */
export default class Speed extends BasePhysics implements Physics{
    constructor(target : any){
        super(target);
    }

    effect() : Promise<any> {
        return new Promise((resolve, reject)=>{
            super.effect().then(()=>{
                if (this.target.xSpeed && this.target.xSpeed !== 0)
                {
                    this.target.setStyle("x", this.target.getX() + this.target.xSpeed);
                }
                if (this.target.ySpeed && this.target.ySpeed !== 0)
                {
                    this.target.setStyle("y", this.target.getY() + this.target.ySpeed);
                }
                resolve();
            }, (data)=>{
                if (data instanceof CollisionReject)//发生碰撞
                {
                    if (data.direction === "x")
                    {
                        this.target.xSpeed = 0;
                        if (this.target.ySpeed && this.target.ySpeed !== 0)
                        {
                            this.target.setStyle("y", this.target.getY() + this.target.ySpeed);
                        }
                    }
                    else if (data.direction === "y")
                    {
                        this.target.ySpeed = 0;
                        if (this.target.xSpeed && this.target.xSpeed !== 0)
                        {
                            this.target.setStyle("x", this.target.getX() + this.target.xSpeed);
                        }
                    }
                }
                reject(data);
            });
        });
    }

    destory(){
        super.destory();
    }
}