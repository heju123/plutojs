import commonUtil from "../../../util/commonUtil";
import Path from "./path";
import Arc from "../arc";
import Point from "../point";

/** 弧线路径 */
export default class ArcPath implements Path{
    target : Arc;//目标点，最终呈现的样子
    private drawTarget : Arc;//绘制对象，主要用于缓动的实现
    duration : number;//执行时间，单位：秒
    show : boolean = false;//是否显示
    anticlockwise : boolean = false;//是否逆时针方向绘制

    constructor(target : Arc, duration? : string){
        this.target = target;
        this.drawTarget = target;
        if (duration)
        {
            this.duration = commonUtil.getTimeSecForSuffix(duration);
        }
    }

    /** 设置绘制对象，从上个路径结束点开始 */
    setDrawTarget(prevPoint : Point){
        if (this.duration)//如果不设置duration，则不需要缓动
        {
            this.drawTarget = new Arc(this.target.centerPoint, this.target.radius,
                this.target.startAngle, this.target.startAngle);
        }
    }

    getDrawTarget() : Arc{
        return this.drawTarget;
    }

    getLastPoint() : Point{
        return this.target.getEndPoint();
    }
}