import Rect from "./rect";
import Component from "./component";

export default class Checkbox extends Rect {
    checked : boolean;
    private startPoint : any;
    private path : Array<any> = [];

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

        this.startPoint = {
            x : ()=>{
                return this.getRealX() + 5;
            },
            y : ()=>{
                return this.getRealY() + this.getHeight() / 2;
            }
        };
        this.path.push({
            x : ()=>{
                return this.getRealX() + this.getWidth() / 2 - 2;
            },
            y : ()=>{
                return this.getRealY() + this.getHeight() - 6;
            }
        });
        this.path.push({
            x : ()=>{
                return this.getRealX() - 3 + this.getWidth();
            },
            y : ()=>{
                return this.getRealY() + 5;
            }
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
            ctx.moveTo(this.startPoint.x(), this.startPoint.y());
            ctx.lineTo(this.path[0].x(), this.path[0].y());
            ctx.lineTo(this.path[1].x(), this.path[1].y());
            ctx.stroke();

            ctx.closePath();
            ctx.restore();
        }
        return true;
    }
}