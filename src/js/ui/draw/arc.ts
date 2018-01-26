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

    /** 两点和一半径求圆中心点坐标 */
    static getCenterPointBy2PointAndRadius(point1 : Point, point2 : Point, radius : number) : Point{
        let pointDistance = Math.sqrt(Math.pow(point2.y - point1.y, 2) + Math.pow(point2.x - point1.x, 2));//两点之间的距离
        let bigAngle = Math.acos(pointDistance / 2 / radius);//反cos求大角
        let littleAngle = Math.atan(point2.y - point1.y / point2.x - point1.x);//用斜率反tan求小角
        let angle = bigAngle - littleAngle;//大角减小角获得需要的角度
        let yOffset = Math.asin(angle) * radius;
        let xOffset = Math.acos(angle) * radius;
        let centerPoint : Point = new Point(point1 + xOffset, point2 + yOffset);
        return centerPoint;
    }
}