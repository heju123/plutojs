import Physics from "./physics";
import BasePhysics from "./basePhysics";
import Thread from "../../util/thread";
import BoxCollisionDetector from "../collision/boxCollisionDetector";
import CollisionDetector from "../collision/collisionDetector";
import CollisionReject from "./effectReject/collisionReject";

/** 碰撞 */
export default class Collision extends BasePhysics implements Physics{
    private collisionDetector : CollisionDetector;
    private detectCollisionThread : Thread;
    private direction : string;//方向，x：检测x方向的碰撞；y：检测y方向的碰撞；xy：同时检测

    constructor(target : any, direction? : string){
        super(target);

        this.direction = direction;

        this.collisionDetector = new BoxCollisionDetector();
        this.detectCollisionThread = new Thread(this.collisionDetector.thread_detectCollision);
    }

    effect() : Promise<any> {
        if (this.isDelay())
        {
            return new Promise((resolve, reject)=>{
                resolve(undefined);
            });
        }
        return new Promise((resolve, reject)=>{
            super.effect().then(()=>{
                if (this.target.xSpeed !== 0 || this.target.ySpeed !== 0)
                {
                    let x = this.target.getX();
                    let y = this.target.getY();
                    if (this.direction && this.direction.indexOf("x") > -1)
                    {
                        x += this.target.xSpeed;
                    }
                    else if (this.direction && this.direction.indexOf("y") > -1)
                    {
                        y += this.target.ySpeed;
                    }
                    this.collisionDetector.detectCollision(this.target, this.target.getX(), this.target.getY(), this.detectCollisionThread, true).then(()=>{
                    }, ()=>{
                    }).finally(()=>{
                        this.collisionDetector.detectCollision(this.target, x, y, this.detectCollisionThread, false).then(()=>{
                            resolve(undefined);
                        }, (data)=>{
                            reject(new CollisionReject(data, this.direction));
                            if ((<any>this).target.onCollision && typeof((<any>this).target.onCollision) === "function")
                            {
                                (<any>this).target.onCollision.apply(this, [data]);
                            }
                        }).finally(()=>{
                        });
                    });
                }
                else
                {
                    resolve(undefined);
                }
            },(data)=>{
                reject(data);
            });
        });
    }

    destroy(){
        super.destroy();
        this.detectCollisionThread.terminate();
    }
}