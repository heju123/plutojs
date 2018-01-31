import commonUtil from "../../../util/commonUtil";
import Path from "./path";
import Curve from "../curve";
import Point from "../point";

/** 弧线路径 */
export default class CurvePath implements Path{
    target : Curve;//目标点，最终呈现的样子
    private drawTarget : Curve;//绘制对象，主要用于缓动的实现
    duration : number;//执行时间，单位：秒
    show : boolean = false;//是否显示
    anticlockwise : boolean = false;//是否逆时针方向绘制
    newPath : boolean = false;

    constructor(target : Curve, duration? : string){
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
            this.drawTarget = new Curve(this.target.centerPoint, this.target.radius,
                this.target.startAngle, this.target.startAngle);
        }
    }

    getDrawTarget() : Curve{
        return this.drawTarget;
    }

    getStartPoint() : Point{
        return this.target.getStartPoint();
    }

    getLastPoint() : Point{
        return this.target.getEndPoint();
    }
}