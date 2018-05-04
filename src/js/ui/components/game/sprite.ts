import Rect from "../rect";
import Component from "../component";
import Speed from "../../../effect/physics/speed";
import Acceleration from "../../../effect/physics/acceleration";
import Collision from "../../../effect/physics/collision";
import ViewState from "../../viewState";

export default class Sprite extends Rect {
    xSpeed : number;
    ySpeed : number;
    xAcceleration : number;
    yAcceleration : number;
    onCollision : Function;

    constructor(parent? : Component | ViewState) {
        super(parent);

        this.xSpeed = 0;//大约一毫秒移动的x距离
        this.ySpeed = 0;//大约一毫秒移动的y距离
        this.xAcceleration = 0;//x加速度，大约一毫秒增加或减小的速度值
        this.yAcceleration = 0;//y加速度

        this.setStyle("zIndex", 1000);
        this.setStyle("alwaysDraw", true);

        let acceleration : Acceleration = new Acceleration(this);
        this.addPhysics(acceleration);
        let speed : Speed = new Speed(this);
        let collisionX : Collision = new Collision(this, "x");
        let collisionY : Collision = new Collision(this, "y");
        speed.pushBeforeQueue(collisionX);
        speed.pushBeforeQueue(collisionY);
        this.addPhysics(speed);
    }
}