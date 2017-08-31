import Rect from "./rect.js";

export default class Scrollbar extends Rect {
    constructor(parent) {
        super(parent);

        this.setX(0);
        this.setY(0);
        if (!parent)//最顶层
        {
            this.setWidth(globalUtil.canvas.width);
            this.setHeight(globalUtil.canvas.height);
        }
        else
        {
            this.setWidth(parent.getInnerWidth());
            this.setHeight(parent.getInnerHeight());
        }
    }

    initCfg(cfg){
        super.initCfg(cfg);
    }

    draw(ctx)
    {
        if (!super.draw(ctx))
        {
            return false;
        }
        ctx.save();
        ctx.beginPath();

        let swidth = this.style.scrollbarWidth || 10;
        let radius = this.style.scrollbarRadius || 6;
        let scrollbarX = this.getWidth() - swidth;
        ctx.fillStyle = this.style.baseLineColor || "#000";
        ctx.globalAlpha = this.style.baseLineAlpha || 0.25;
        this.getRectRadiusPath(this.getRealX() + scrollbarX, this.getRealY(), swidth, this.getHeight(), ctx, radius);
        ctx.fill();

        ctx.closePath();
        ctx.restore();
        return true;
    }

    appendChildren(child){
        super.appendChildren(child);

        this.propagationDoLayout(this);
    }

    doLayout(){
        let maxWidth = 0;
        let maxHeight = 0;
        this.children.forEach((child, index)=>{
            maxWidth = Math.max(maxWidth, child.getX() + child.getWidth());
            maxHeight = Math.max(maxHeight, child.getY() + child.getHeight());
        });
        this.style.contentWidth = maxWidth;
        this.style.contentHeight = maxHeight;
    }
}