import Point from "./point";
import Component from "../components/component";

/** 二次贝塞尔曲线 */
export default class QuadraticCurve{
    component : Component;
    ctrlPoint : Point;
    endPoint : Point;

    constructor(component : Component, ctrlPoint : Point, endPoint : Point)
    {
        this.component = component;
        this.ctrlPoint = ctrlPoint;
        this.endPoint = endPoint;
    }

    draw(ctx){
        ctx.quadraticCurveTo(this.ctrlPoint.x + this.component.getRealX(),this.ctrlPoint.y + this.component.getRealY(),
            this.endPoint.x + this.component.getRealX(),this.endPoint.y + this.component.getRealY());
    }
}