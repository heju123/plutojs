import Point from "../point";

interface Path{
    target : Point;
    duration : number;//执行时间，单位：秒
    show : boolean;//是否显示

    setDrawTarget(prevTarget : Point);
    getDrawTarget() : Point;

    /** 获取最后绘制的点 */
    getLastPoint() : Point;
}
export default Path