import Point from "../point";
import Arc from "../arc";

interface Path{
    target : Point | Arc;
    duration : number;//执行时间，单位：秒
    show : boolean;//是否显示
    newPath : boolean;//是否是一个新的路径（不和上一个路径连续），默认false

    setDrawTarget(prevTarget : Point | Arc);
    getDrawTarget() : Point | Arc;

    /** 获取开始绘制的点 */
    getStartPoint() : Point;
    /** 获取最后绘制的点 */
    getLastPoint() : Point;
}
export default Path