import Component from "../components/component";
import Controller from "../controller";
import Point from "./point";

export default class SequenceDraw{
    private self : Component | Controller;//执行绘制的组件或controller
    private startPoint : Point;
    private paths : Array<any> = [];

    constructor(self : Component){
        this.self = self;
    }

    setStartPoint(point : Point){
        this.startPoint = point;
    }

    pushPath(path : Point){
        this.paths.push(path);
    }

    draw(ctx : CanvasRenderingContext2D){
        ctx.moveTo(this.startPoint.x, this.startPoint.y);
        this.paths.forEach((path)=>{
            if (path instanceof Point)
            {
                ctx.lineTo(path.x, path.y);
            }
        });
        ctx.stroke();
    }
}