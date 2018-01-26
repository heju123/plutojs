import Point from "../point";
import Arc from "../arc";

interface Path{
    target : Point | Arc;
    duration : number;//执行时间，单位：秒
    show : boolean;//是否显示

    setDrawTarget(prevTarget : Point | Arc);
    getDrawTarget() : Point | Arc;

    /** 获取最后绘制的点 */
    getLastPoint() : Point;
}
export default Path