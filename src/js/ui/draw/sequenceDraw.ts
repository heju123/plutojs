import Component from "../components/component";
import Controller from "../controller";
import Point from "./point";
import Path from "./path/path";
import animationUtil from "../../util/animationUtil";

export default class SequenceDraw{
    private self : Component | Controller;//执行绘制的组件或controller
    private startPoint : Point;
    private paths : Array<Path> = [];
    private doAniIndex : number;

    constructor(self : Component){
        this.self = self;
    }

    setStartPoint(point : Point){
        this.startPoint = point;
    }

    pushPath(path : Path){
        if (this.paths.length > 0)
        {
            path.setDrawTarget(this.paths[this.paths.length - 1].getLastPoint());
        }
        else
        {
            path.setDrawTarget(this.startPoint);
        }
        this.paths.push(path);
    }

    clearPath(){
        this.paths.length = 0;
    }

    /** 结束pushPath的调用，并开始执行绘制动画 */
    finish(){
        if (this.paths.length > 0)
        {
            this.doAniIndex = 0;
            this.doDrawAni();
        }
    }

    private doDrawAni(){
        let path = this.paths[this.doAniIndex];
        if (path.duration)
        {
            path.show = true;
            if (path.getDrawTarget() instanceof Point)
            {
                let to = {
                  x : path.target.x,
                  y : path.target.y
                };
                animationUtil.executeAttrChange(path.getDrawTarget(), to, {
                    duration : path.duration,
                    easeType : "Linear",
                    easing : "ease"
                }).then(()=>{
                    this.doAniIndex++;
                    this.doDrawAni();
                });
            }
        }
    }

    draw(ctx : CanvasRenderingContext2D){
        ctx.moveTo(this.startPoint.x, this.startPoint.y);
        this.paths.forEach((path)=>{
            if (path.show)
            {
                if (path.target instanceof Point)
                {
                    ctx.lineTo(path.getDrawTarget().x, path.getDrawTarget().y);
                }
            }
        });
        ctx.stroke();
    }
}