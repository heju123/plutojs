import Point from "./point";

export default class Arc{
    centerPoint : Point;//圆中心坐标
    radius : number;
    startAngle : number;//起始角度
    endAngle : number;//结束角度

    constructor(centerPoint : Point, radius : number, startAngle : number, endAngle : number)
    {
        this.centerPoint = centerPoint;
        this.radius = radius;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
    }

    /** 获取弧线结束点坐标 */
    getEndPoint() : Point{
        let angy : number = Math.sin(this.endAngle) * this.radius;
        let angx : number = Math.cos(this.endAngle) * this.radius;
        let endPoint : Point = new Point(angx + this.centerPoint.x, angy + this.centerPoint.y);
        return endPoint;
    }
}