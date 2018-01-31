import Point from "../point";
import Arc from "../arc";

interface Path{
    target : Point | Arc;
    duration : number;//执行时间，单位：秒
    show : boolean;//是否显示
    newPath : boolean;//是否是一个新的路径（不和上一个路径连续），默认false

    /**
     * 设置绘制对象，从上个路径结束点开始
     *
     * @param 开始绘制的点，可以是上个路径的结束点
     */
    setStartPoint(prevTarget : Point | Arc);

    /** 获取绘制对象 */
    getDrawTarget() : Point | Arc;

    /** 获取开始绘制的点 */
    getStartPoint() : Point;
    /** 获取最后绘制的点 */
    getLastPoint() : Point;
}
export default Path