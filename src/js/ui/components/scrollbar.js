import Component from "./component.js";

export default class Scrollbar extends Component {
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
            this.setWidth(parent.getWidth());
            this.setHeight(parent.getHeight());
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

        ctx.closePath();
        ctx.restore();
    }
}