import Point from "./point";
import Component from "../components/component";

/** 三次贝塞尔曲线 */
export default class BezierCurve{
    component : Component;
    ctrl1Point : Point;
    ctrl2Point : Point;
    endPoint : Point;

    constructor(component : Component, ctrl1Point : Point, ctrl2Point : Point, endPoint : Point)
    {
        this.component = component;
        this.ctrl1Point = ctrl1Point;
        this.ctrl2Point = ctrl2Point;
        this.endPoint = endPoint;
    }

    draw(ctx){
        ctx.bezierCurveTo(this.ctrl1Point.x + this.component.getRealX(),this.ctrl1Point.y + this.component.getRealY(),
            this.ctrl2Point.x + this.component.getRealX(),this.ctrl2Point.y + this.component.getRealY(),
            this.endPoint.x + this.component.getRealX(), this.endPoint.y + this.component.getRealY());
    }
}