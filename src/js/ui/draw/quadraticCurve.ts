import Point from "./point";

/** 二次贝塞尔曲线 */
export default class QuadraticCurve{
    ctrlPoint : Point;
    endPoint : Point;

    constructor(ctrlPoint : Point, endPoint : Point)
    {
        this.ctrlPoint = ctrlPoint;
        this.endPoint = endPoint;
    }

    draw(ctx){
        ctx.quadraticCurveTo(this.ctrlPoint.x,this.ctrlPoint.y,this.endPoint.x,this.endPoint.y);
    }
}