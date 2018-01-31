import Component from "../components/component";
import Point from "./point";
import PointPath from "./path/pointPath";
import ArcPath from "./path/arcPath";
import Path from "./path/path";
import animationUtil from "../../util/animationUtil";

/** 按顺序绘制，可实现缓动 */
export default class SequenceDraw{
    private parent : Component;
    private startPoint : Point;
    private paths : Array<Path> = [];

    constructor(parent : Component){
        this.parent = parent;
    }

    setStartPoint(point : Point){
        this.startPoint = point;
    }

    pushPath(path : Path){
        if (this.paths.length > 0)
        {
            path.setStartPoint(this.paths[this.paths.length - 1].getLastPoint());
        }
        else
        {
            path.setStartPoint(this.startPoint);
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
            let doAniIndex = 0;
            this.doDrawAni(doAniIndex);
        }
    }

    private doDrawAni(index : number){
        let path = this.paths[index];
        if (!path)
        {
            return;
        }
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
                    index++;
                    this.doDrawAni(index);
                });
            }
            else if (path instanceof ArcPath)
            {
                let to = {
                    endAngle : path.target.endAngle
                };
                animationUtil.executeAttrChange(path.getDrawTarget(), to, {
                    duration : path.duration,
                    easeType : "Linear",
                    easing : "ease"
                }).then(()=>{
                    index++;
                    this.doDrawAni(index);
                });
            }
        }
        else
        {
            index++;
            this.doDrawAni(index);
        }
    }

    draw(ctx : CanvasRenderingContext2D){
        if (!this.startPoint)
        {
            return;
        }
        ctx.moveTo(this.startPoint.x + this.parent.getRealX(), this.startPoint.y + this.parent.getRealY());
        this.paths.forEach((path)=>{
            if (path.show)
            {
                if (path.newPath)
                {
                    ctx.moveTo(path.getStartPoint().x + this.parent.getRealX(), path.getStartPoint().y + this.parent.getRealY());
                }
                if (path instanceof PointPath)
                {
                    ctx.lineTo(path.getDrawTarget().x + this.parent.getRealX(), path.getDrawTarget().y + this.parent.getRealY());
                }
                else if (path instanceof ArcPath)
                {
                    ctx.arc(path.getDrawTarget().centerPoint.x + this.parent.getRealX(),
                        path.getDrawTarget().centerPoint.y + this.parent.getRealY(),
                        path.getDrawTarget().radius, path.getDrawTarget().startAngle, path.getDrawTarget().endAngle, path.anticlockwise);
                }
            }
        });
        ctx.stroke();
    }
}