import Component from "../components/component";
import Controller from "../controller";
import Point from "./point";
import PointPath from "./path/pointPath";
import Path from "./path/path";
import animationUtil from "../../util/animationUtil";

/** 按顺序绘制，可实现缓动 */
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
        path.show = true;
        if (path.duration)
        {
            if (path instanceof PointPath)
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
        else
        {
            this.doAniIndex++;
            this.doDrawAni();
        }
    }

    draw(ctx : CanvasRenderingContext2D){
        ctx.moveTo(this.startPoint.x, this.startPoint.y);
        this.paths.forEach((path)=>{
            if (path.show)
            {
                if (path instanceof PointPath)
                {
                    ctx.lineTo(path.getDrawTarget().x, path.getDrawTarget().y);
                }
            }
        });
        ctx.stroke();
    }
}