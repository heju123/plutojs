import {Controller,Component,SequenceDraw,Point,PointPath,Curve,CurvePath,Path} from "~/js/main";

export default class DrawController extends Controller{
    private arcTestDraw : SequenceDraw;

    constructor(component : Component) {
        super(component);

        this.registerEvent("$onViewLoaded", ()=>{
            let scrollbar = this.component.getComponentById("scrollbar");
            this.arcTestDraw = new SequenceDraw(scrollbar);

            //连线1
            let rect1 = this.component.getComponentById("rect1");
            let rect2 = this.component.getComponentById("rect2");
            let point1 : Point = new Point(rect1.getX() + rect1.getWidth() / 2, rect1.getY() + rect1.getHeight() / 2);
            let point2 : Point = new Point(rect2.getX() + rect2.getWidth() / 2, rect2.getY() + rect2.getHeight() / 2);
            let centerOffset = Curve.getCenterPointOffsetBy2PointAndRadius(point1, point2, 100);
            let centerPoint : Point = new Point(point1.x + centerOffset[0], point1.y - centerOffset[1]);
            let startAngle : number = -Curve.getAngleByPoint(point1, centerPoint) - Math.PI;
            let endAngle : number = -Curve.getAngleByPoint(point2, centerPoint) - Math.PI;

            this.arcTestDraw.setStartPoint(point1);
            let arc : Curve = new Curve(centerPoint, 100, startAngle, endAngle);
            let arcPath : Path = new CurvePath(arc, "1s");
            (<CurvePath>arcPath).anticlockwise = true;
            this.arcTestDraw.pushPath(arcPath);

            //连线2
            let rect3 = this.component.getComponentById("rect3");
            let rect4 = this.component.getComponentById("rect4");
            point1 = new Point(rect3.getX() + rect3.getWidth() / 2, rect3.getY() + rect3.getHeight() / 2);
            point2 = new Point(rect4.getX() + rect4.getWidth() / 2, rect4.getY() + rect4.getHeight() / 2);
            centerOffset = Curve.getCenterPointOffsetBy2PointAndRadius(point1, point2, 80);
            centerPoint = new Point(point1.x - centerOffset[0], point1.y - centerOffset[1]);
            startAngle = -Curve.getAngleByPoint(point1, centerPoint);
            endAngle = Curve.getAngleByPoint(point2, centerPoint);

            arc = new Curve(centerPoint, 80, startAngle, endAngle);
            arcPath = new CurvePath(arc, "1s");
            (<CurvePath>arcPath).anticlockwise = false;
            arcPath.newPath = true;
            this.arcTestDraw.pushPath(arcPath);

            //连线3
            let rect5 = this.component.getComponentById("rect5");
            let rect6 = this.component.getComponentById("rect6");
            point1 = new Point(rect5.getX() + rect5.getWidth() / 2, rect5.getY() + rect5.getHeight() / 2);
            point2 = new Point(rect6.getX() + rect6.getWidth() / 2, rect6.getY() + rect6.getHeight() / 2);
            centerOffset = Curve.getCenterPointOffsetBy2PointAndRadius(point1, point2, 160);
            centerPoint = new Point(point2.x - centerOffset[0], point2.y + centerOffset[1]);
            startAngle = 2 * Math.PI - Curve.getAngleByPoint(point1, centerPoint);
            endAngle = 2 * Math.PI - Curve.getAngleByPoint(point2, centerPoint);

            arc = new Curve(centerPoint, 160, startAngle, endAngle);
            arcPath = new CurvePath(arc, "1s");
            (<CurvePath>arcPath).anticlockwise = false;
            arcPath.newPath = true;
            this.arcTestDraw.pushPath(arcPath);

            //连线4
            let rect7 = this.component.getComponentById("rect7");
            let rect8 = this.component.getComponentById("rect8");
            point1 = new Point(rect7.getX() + rect7.getWidth() / 2, rect7.getY() + rect7.getHeight() / 2);
            point2 = new Point(rect8.getX() + rect8.getWidth() / 2, rect8.getY() + rect8.getHeight() / 2);
            centerOffset = Curve.getCenterPointOffsetBy2PointAndRadius(point1, point2, 100);
            centerPoint = new Point(point2.x + centerOffset[0], point2.y + centerOffset[1]);
            startAngle = -Math.PI + Curve.getAngleByPoint(point1, centerPoint);
            endAngle = -Math.PI - Curve.getAngleByPoint(point2, centerPoint);

            arc = new Curve(centerPoint, 100, startAngle, endAngle);
            arcPath = new CurvePath(arc, "1s");
            (<CurvePath>arcPath).anticlockwise = true;
            arcPath.newPath = true;
            this.arcTestDraw.pushPath(arcPath);

            //连线5
            let rect9 = this.component.getComponentById("rect9");
            let rect10 = this.component.getComponentById("rect10");
            point1 = new Point(rect9.getX() + rect9.getWidth() / 2, rect9.getY() + rect9.getHeight() / 2);
            point2 = new Point(rect10.getX() + rect10.getWidth() / 2, rect10.getY() + rect10.getHeight() / 2);
            centerOffset = Curve.getCenterPointOffsetBy2PointAndRadius(point1, point2, 100);
            centerPoint = new Point(point1.x + centerOffset[0], point1.y + centerOffset[1]);
            startAngle = Math.PI + Curve.getAngleByPoint(point1, centerPoint);
            endAngle = Math.PI * 2 - Curve.getAngleByPoint(point2, centerPoint);

            arc = new Curve(centerPoint, 100, startAngle, endAngle);
            arcPath = new CurvePath(arc, "1s");
            (<CurvePath>arcPath).anticlockwise = false;
            arcPath.newPath = true;
            this.arcTestDraw.pushPath(arcPath);

            //连线6
            point1 = new Point(rect9.getX() + rect9.getWidth() / 2, rect9.getY() + rect9.getHeight() / 2);
            point2 = new Point(rect10.getX() + rect10.getWidth() / 2, rect10.getY() + rect10.getHeight() / 2);
            centerOffset = Curve.getCenterPointOffsetBy2PointAndRadius(point1, point2, 150);
            centerPoint = new Point(point1.x + centerOffset[0], point1.y - centerOffset[1]);
            startAngle = -Math.PI - Curve.getAngleByPoint(point1, centerPoint);
            endAngle = -Math.PI * 2 + Curve.getAngleByPoint(point2, centerPoint);

            arc = new Curve(centerPoint, 150, startAngle, endAngle);
            arcPath = new CurvePath(arc, "1s");
            (<CurvePath>arcPath).anticlockwise = true;
            arcPath.newPath = true;
            this.arcTestDraw.pushPath(arcPath);

            //连线7
            let rect13 = this.component.getComponentById("rect13");
            let rect14 = this.component.getComponentById("rect14");
            point1 = new Point(rect13.getX() + rect13.getWidth() / 2, rect13.getY() + rect13.getHeight() / 2);
            point2 = new Point(rect14.getX() + rect14.getWidth() / 2, rect14.getY() + rect14.getHeight() / 2);
            centerOffset = Curve.getCenterPointOffsetBy2PointAndRadius(point1, point2, 103);
            centerPoint = new Point(point1.x + centerOffset[0], point1.y + centerOffset[1]);
            startAngle = -Math.PI + Curve.getAngleByPoint(point1, centerPoint);
            endAngle = -Math.PI - Curve.getAngleByPoint(point2, centerPoint);

            arc = new Curve(centerPoint, 103, startAngle, endAngle);
            arcPath = new CurvePath(arc, "1s");
            (<CurvePath>arcPath).anticlockwise = true;
            arcPath.newPath = true;
            this.arcTestDraw.pushPath(arcPath);

            //连线8
            point1 = new Point(rect13.getX() + rect13.getWidth() / 2, rect13.getY() + rect13.getHeight() / 2);
            point2 = new Point(rect14.getX() + rect14.getWidth() / 2, rect14.getY() + rect14.getHeight() / 2);
            centerOffset = Curve.getCenterPointOffsetBy2PointAndRadius(point1, point2, 123);
            centerPoint = new Point(point1.x - centerOffset[0], point1.y + centerOffset[1]);
            startAngle = -Curve.getAngleByPoint(point1, centerPoint);
            endAngle = Curve.getAngleByPoint(point2, centerPoint);

            arc = new Curve(centerPoint, 123, startAngle, endAngle);
            arcPath = new CurvePath(arc, "1s");
            (<CurvePath>arcPath).anticlockwise = false;
            arcPath.newPath = true;
            this.arcTestDraw.pushPath(arcPath);

            this.arcTestDraw.finish();
        });
    }

    draw(ctx : CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#333";
        this.arcTestDraw.draw(ctx);
        ctx.closePath();
    }
}