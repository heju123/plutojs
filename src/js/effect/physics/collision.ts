import Physics from "./physics";
import BasePhysics from "./basePhysics";
import Thread from "../../../util/thread";
import BoxCollisionDetector from "../collision/boxCollisionDetector";
import CollisionDetector from "../collision/collisionDetector";
import CollisionReject from "./effectReject/collisionReject";

/** 加速度 */
export default class Collision extends BasePhysics implements Physics{
    private collisionDetector : CollisionDetector;
    private detectCollisionThread : Thread;
    private direction : string;//方向，x：检测x方向的碰撞；y：检测y方向的碰撞；xy：同时检测

    constructor(direction){
        super();

        this.direction = direction;

        this.collisionDetector = new BoxCollisionDetector();
        this.detectCollisionThread = new Thread(this.collisionDetector.thread_detectCollision);
    }

    effect() : Promise<any> {
        return new Promise((resolve, reject)=>{
            super.effect().then(()=>{
                let x = this.target.getX();
                let y = this.target.getY();
                if (this.direction.indexOf("x") > -1)
                {
                    x += this.target.xSpeed;
                }
                else if (this.direction.indexOf("y") > -1)
                {
                    y += this.target.ySpeed;
                }
                this.collisionDetector.detectCollision(this.target, x, y, this.detectCollisionThread, true).then(()=>{
                    resolve();
                }, (data)=>{
                    reject(new CollisionReject("collision", data));
                    if (this.onCollision && typeof(this.onCollision) === "function")
                    {
                        this.onCollision.apply(this, [data]);
                    }
                }).finally(()=>{
                });
            },(data)=>{
                reject(data);
            });
        });
    }
}