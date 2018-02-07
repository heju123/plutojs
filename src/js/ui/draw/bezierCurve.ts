import Point from "./point";

/** 三次贝塞尔曲线 */
export default class BezierCurve{
    ctrl1Point : Point;
    ctrl2Point : Point;
    endPoint : Point;

    constructor(ctrl1Point : Point, ctrl2Point : Point, endPoint : Point)
    {
        this.ctrl1Point = ctrl1Point;
        this.ctrl2Point = ctrl2Point;
        this.endPoint = endPoint;
    }

    draw(ctx){
        ctx.bezierCurveTo(this.ctrl1Point.x,this.ctrl1Point.y,
            this.ctrl2Point.x,this.ctrl2Point.y,this.endPoint.x,this.endPoint.y);
    }
}