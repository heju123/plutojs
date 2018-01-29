import {Controller,Component,SequenceDraw,Point,PointPath,Arc,ArcPath,Path} from "~/js/main";

export default class DrawController extends Controller{
    private arcTestDraw : SequenceDraw = new SequenceDraw(this.component);

    constructor(component : Component) {
        super(component);

        this.registerEvent("$onViewLoaded", ()=>{
            //连线1
            let rect1 = this.component.getComponentById("rect1");
            let rect2 = this.component.getComponentById("rect2");
            let point1 : Point = new Point(rect1.getRealX() + rect1.getWidth() / 2, rect1.getRealY() + rect1.getHeight() / 2);
            let point2 : Point = new Point(rect2.getRealX() + rect2.getWidth() / 2, rect2.getRealY() + rect2.getHeight() / 2);
            let centerOffset = Arc.getCenterPointOffsetBy2PointAndRadius(point1, point2, 100);
            let centerPoint : Point = new Point(point1.x + centerOffset[0], point1.y - centerOffset[1]);
            let startAngle : number = -Arc.getAngleByPoint(point1, centerPoint) - Math.PI;
            let endAngle : number = -Arc.getAngleByPoint(point2, centerPoint) - Math.PI;

            this.arcTestDraw.setStartPoint(point1);
            let arc : Arc = new Arc(centerPoint, 100, startAngle, endAngle);
            let arcPath : Path = new ArcPath(arc, "1s");
            arcPath.anticlockwise = true;
            this.arcTestDraw.pushPath(arcPath);

            //连线2
            let rect3 = this.component.getComponentById("rect3");
            let rect4 = this.component.getComponentById("rect4");
            point1 = new Point(rect3.getRealX() + rect3.getWidth() / 2, rect3.getRealY() + rect3.getHeight() / 2);
            point2 = new Point(rect4.getRealX() + rect4.getWidth() / 2, rect4.getRealY() + rect4.getHeight() / 2);
            centerOffset = Arc.getCenterPointOffsetBy2PointAndRadius(point1, point2, 80);
            centerPoint = new Point(point1.x - centerOffset[0], point1.y - centerOffset[1]);
            startAngle = -Arc.getAngleByPoint(point1, centerPoint);
            endAngle = Arc.getAngleByPoint(point2, centerPoint);

            arc = new Arc(centerPoint, 80, startAngle, endAngle);
            arcPath = new ArcPath(arc, "1s");
            arcPath.anticlockwise = false;
            arcPath.newPath = true;
            this.arcTestDraw.pushPath(arcPath);

            //连线3
            let rect5 = this.component.getComponentById("rect5");
            let rect6 = this.component.getComponentById("rect6");
            point1 = new Point(rect5.getRealX() + rect5.getWidth() / 2, rect5.getRealY() + rect5.getHeight() / 2);
            point2 = new Point(rect6.getRealX() + rect6.getWidth() / 2, rect6.getRealY() + rect6.getHeight() / 2);
            centerOffset = Arc.getCenterPointOffsetBy2PointAndRadius(point1, point2, 160);
            centerPoint = new Point(point2.x - centerOffset[0], point2.y + centerOffset[1]);
            startAngle = 2 * Math.PI - Arc.getAngleByPoint(point1, centerPoint);
            endAngle = 2 * Math.PI - Arc.getAngleByPoint(point2, centerPoint);

            arc = new Arc(centerPoint, 160, startAngle, endAngle);
            arcPath = new ArcPath(arc, "1s");
            arcPath.anticlockwise = false;
            arcPath.newPath = true;
            this.arcTestDraw.pushPath(arcPath);

            //连线4
            let rect7 = this.component.getComponentById("rect7");
            let rect8 = this.component.getComponentById("rect8");
            point1 = new Point(rect7.getRealX() + rect7.getWidth() / 2, rect7.getRealY() + rect7.getHeight() / 2);
            point2 = new Point(rect8.getRealX() + rect8.getWidth() / 2, rect8.getRealY() + rect8.getHeight() / 2);
            centerOffset = Arc.getCenterPointOffsetBy2PointAndRadius(point1, point2, 100);
            centerPoint = new Point(point2.x + centerOffset[0], point2.y + centerOffset[1]);
            startAngle = -Math.PI + Arc.getAngleByPoint(point1, centerPoint);
            endAngle = -Math.PI - Arc.getAngleByPoint(point2, centerPoint);

            arc = new Arc(centerPoint, 100, startAngle, endAngle);
            arcPath = new ArcPath(arc, "1s");
            arcPath.anticlockwise = true;
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