import Rect from "./rect";
import Component from "./component";
import Point from "../draw/point";
import SequenceDraw from "../draw/sequenceDraw";

export default class Checkbox extends Rect {
    checked : boolean;
    private sequenceDraw : SequenceDraw = new SequenceDraw(this);

    constructor(parent? : Component) {
        super(parent);

        this.setStyle({
            width : 25,
            height : 25,
            backgroundColor : "#f2f2f2",
            borderWidth : 1,
            borderColor : "#7c7c7c"
        });

        this.registerEvent("click", ()=>{
            this.checked = !this.checked;
        });

        this.registerEvent("$onViewLoaded", ()=>{
            let startPoint = new Point(this.getRealX() + 5, this.getRealY() + this.getHeight() / 2);
            this.sequenceDraw.setStartPoint(startPoint);
            let point = new Point(this.getRealX() + this.getWidth() / 2 - 2, this.getRealY() + this.getHeight() - 6);
            this.sequenceDraw.pushPath(point);
            point = new Point(this.getRealX() - 3 + this.getWidth(), this.getRealY() + 5);
            this.sequenceDraw.pushPath(point);
        });
    }

    initCfg(cfg : any) : Promise<any>{
        let promise = super.initCfg(cfg);

        this.checked = cfg.checked;
        return promise;
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