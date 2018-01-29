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

    getStartPoint() : Point{
        let angy : number = Math.sin(this.startAngle) * this.radius;
        let angx : number = Math.cos(this.startAngle) * this.radius;
        let startPoint : Point = new Point(angx + this.centerPoint.x, angy + this.centerPoint.y);
        return startPoint;
    }

    /** 获取弧线结束点坐标 */
    getEndPoint() : Point{
        let angy : number = Math.sin(this.endAngle) * this.radius;
        let angx : number = Math.cos(this.endAngle) * this.radius;
        let endPoint : Point = new Point(angx + this.centerPoint.x, angy + this.centerPoint.y);
        return endPoint;
    }

    /**
     * 两点和一半径求圆中心点坐标相对于point1或point2的offset,有了offset需要根据实际情况计算最终的中心点坐标
     * 相对于point1还是point2需要根据圆心方向定
     *
     * @param point1 第一个点
     * @param point2 第二个点
     * @param radius 圆的半径
     * @return [xOffset,yOffset]
     */
    static getCenterPointOffsetBy2PointAndRadius(point1 : Point, point2 : Point, radius : number) : Array<number>{
        let yOffset : number;
        let xOffset : number;
        let pointDistance : number = Math.sqrt(Math.pow(Math.abs(point2.y - point1.y), 2) + Math.pow(Math.abs(point2.x - point1.x), 2));//两点之间的距离
        if (point2.y - point1.y !== 0 && point2.x - point1.x !== 0)
        {
            let bigAngle : number = Math.acos(pointDistance / 2 / radius);//反cos求大角
            let littleAngle : number = Math.atan(Math.abs(point2.y - point1.y) / Math.abs(point2.x - point1.x));//用斜率反tan求小角
            let angle : number = bigAngle - littleAngle;//大角减小角获得需要的角度
            yOffset = Math.sin(angle) * radius;
            xOffset = Math.cos(angle) * radius;
        }
        else if (point2.y - point1.y === 0 && point2.x - point1.x !== 0)//两点连线呈水平直线
        {
            let angle = Math.acos(pointDistance / 2 / radius);
            xOffset = pointDistance / 2;
            yOffset = Math.tan(angle) * (pointDistance / 2);
        }
        else if (point2.y - point1.y !== 0 && point2.x - point1.x === 0)//两点连线呈垂直直线
        {
            let angle = Math.acos(pointDistance / 2 / radius);
            yOffset = pointDistance / 2;
            xOffset = Math.tan(angle) * (pointDistance / 2);
        }
        return [xOffset, yOffset];
    }

    /** 一个点获取角度，需要先知道圆心坐标 */
    static getAngleByPoint(point : Point, centerPoint : Point) : number{
        return Math.abs(Math.atan(Math.abs(point.y - centerPoint.y) / Math.abs(point.x - centerPoint.x)));
    }
}