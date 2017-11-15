import Rect from "./rect.js";

export default class Checkbox extends Rect {
    constructor(parent) {
        super(parent);

        this.setStyle({
            width : 25,
            height : 25,
            backgroundColor : "#dfdfdf",
            borderWidth : 1,
            borderColor : "#7a7a7a"
        });

        this.registerEvent("click", ()=>{
            this.checked = !this.checked;
        });
    }

    initCfg(cfg){
        let promise = super.initCfg(cfg);

        this.checked = cfg.checked;
        return promise;
    }

    draw(ctx) {
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
            let oriX = this.getRealX();
            let oriY = this.getRealY();
            ctx.moveTo(oriX + 5, oriY + this.getHeight() / 2);
            ctx.lineTo(oriX + this.getWidth() / 2 - 2, oriY + this.getHeight() - 6);
            ctx.lineTo(oriX - 3 + this.getWidth(), oriY + 5);
            ctx.stroke();

            ctx.closePath();
            ctx.restore();
        }
        return true;
    }
}