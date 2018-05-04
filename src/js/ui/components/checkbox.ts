import Rect from "./rect";
import Component from "./component";
import Point from "../draw/point";
import Path from "../draw/path/path";
import PointPath from "../draw/path/pointPath";
import SequenceDraw from "../draw/sequenceDraw";
import ViewState from "../viewState";

export default class Checkbox extends Rect {
    checked : boolean;
    private sequenceDraw : SequenceDraw = new SequenceDraw(this);

    constructor(parent? : Component | ViewState) {
        super(parent);

        this.setStyle({
            width : 25,
            height : 25,
            backgroundColor : "#f2f2f2",
            borderWidth : 1,
            borderColor : "#7c7c7c"
        });

        this.registerEvent("click", ()=> {
            if (!this.checked)
            {
                this.initCheckedAni();
                this.checked = true;
            }
            else
            {
                this.checked = false;
            }
        });

        this.registerEvent("$onViewLoaded", ()=>{
            this.initCheckedAni();
        });
    }

    initCfg(cfg : any) : Promise<any>{
        let promise = super.initCfg(cfg);

        this.checked = cfg.checked;
        return promise;
    }

    //初始化check动画
    private initCheckedAni(){
        this.sequenceDraw.clearPath();
        let startPoint : Point = new Point(5, this.getHeight() / 2);
        this.sequenceDraw.setStartPoint(startPoint);

        let point1 : Point = new Point(this.getWidth() / 2 - 2, this.getHeight() - 6);
        let path1 : Path = new PointPath(point1, "250ms");
        this.sequenceDraw.pushPath(path1);

        let point2 : Point = new Point(this.getWidth() - 3, 5);
        let path2 : Path = new PointPath(point2, "200ms");
        this.sequenceDraw.pushPath(path2);
        this.sequenceDraw.finish();
    }

    draw(ctx : CanvasRenderingContext2D) : boolean {
        if (!super.draw(ctx)) {
            return false;
        }

        if (this.checked)
        {
            ctx.save();
            this.setClip(ctx);
            ctx.beginPath();
            this.setCommonStyle(ctx);

            ctx.lineWidth = this.style.lineWidth || 4;
            ctx.strokeStyle = "#333";
            this.sequenceDraw.draw(ctx);

            ctx.closePath();
            ctx.restore();
        }
        return true;
    }
}