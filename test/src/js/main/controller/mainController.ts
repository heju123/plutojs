/**
 * Created by heju on 2017/7/14.
 */
import {Controller,Component,Thread,SequenceDraw,Point,PointPath,Curve,CurvePath,Path} from "~/js/main";

export default class MainController extends Controller{
    private sequenceDraw : SequenceDraw = new SequenceDraw(this.component);

    constructor(component : Component) {
        super(component);

        let thread = new Thread(this.testThread);

        thread.run({aaa : "321"}, function(key, value) {
            return value;
        }).then(function(data){
            console.log(data);
            thread.terminate();
        }).finally(()=>{
            console.log("finally");
        });

        this.registerEvent("$onViewLoaded", ()=>{
            this.sequenceDraw.clearPath();
            let startPoint : Point = new Point(250, 350);
            this.sequenceDraw.setStartPoint(startPoint);

            let point : Point = new Point(300, 450);
            let path : Path = new PointPath(point, "1s");
            this.sequenceDraw.pushPath(path);

            let centerPoint : Point = new Point(250, 450);
            let arc : Curve = new Curve(centerPoint, 50, 0, -0.5 * Math.PI);
            let arcPath : Path = new CurvePath(arc, "1s");
            (<CurvePath>arcPath).anticlockwise = true;
            this.sequenceDraw.pushPath(arcPath);

            let point2 : Point = new Point(100, 450);
            let path2 : Path = new PointPath(point2, "1s");
            this.sequenceDraw.pushPath(path2);
            this.sequenceDraw.finish();
        });
    }

    testThread(e){
        console.log(e.data);

        (<any>self).postMessage("callback");
    }

    mouseDown(e){
        console.log("main mouseDown!");
    }

    clickMain(e){
        console.log(e);
    }

    clickInput(e){
        console.log(e);
        e.stopPropagation();
    }

    mousedownInput(e){
        console.log("input mousedown");
    }

    changeRoute(e){
        let mainRoute = this.viewState.getComponentById("mainRoute");
        mainRoute.changeRoute("test");
    }

    goMovement(e){
        let mainRoute = this.viewState.getComponentById("mainRoute");
        mainRoute.changeRoute("movement", true);
    }

    getAllInput(e)
    {
        console.log(this.viewState.getComponentsByName("input"));
        e.stopPropagation();
    }

    onClickCheckbox(e)
    {
        console.log(e.target.checked);
    }

    draw(ctx : CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#333";
        this.sequenceDraw.draw(ctx);

        ctx.closePath();
    }
}