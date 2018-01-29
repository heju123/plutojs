import commonUtil from "../../../util/commonUtil";
import Path from "./path";
import Point from "../point";

/** 点路径（直线） */
export default class PointPath implements Path{
    private startPoint : Point;//开始点，点路径的开始点是上个路径的结束点，或者是开始点
    target : Point;//目标点，最终呈现的样子
    private drawTarget : Point;//绘制对象，主要用于缓动的实现
    duration : number;//执行时间，单位：秒
    show : boolean = false;//是否显示
    newPath : boolean = false;

    constructor(target : Point, duration? : string){
        this.target = target;
        this.drawTarget = target;
        if (duration)
        {
            this.duration = commonUtil.getTimeSecForSuffix(duration);
        }
    }

    /** 设置绘制对象，从上个路径结束点开始 */
    setDrawTarget(prevPoint : Point){
        this.startPoint = prevPoint;
        if (this.duration)//如果不设置duration，则不需要缓动
        {
            this.drawTarget = new Point(prevPoint.x, prevPoint.y);
        }
    }

    getDrawTarget() : Point{
        return this.drawTarget;
    }

    getStartPoint() : Point{
        return this.startPoint;
    }

    getLastPoint() : Point{
        return new Point(this.target.x, this.target.y);
    }
}