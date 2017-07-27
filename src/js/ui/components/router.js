import globalUtil from "../../util/globalUtil.js";
import Component from "./component.js";

export default class Router extends Component{
    constructor(parent){
        super(parent);
        this.x = 0;
        this.y = 0;
        if (!parent)//最顶层
        {
            this.width = globalUtil.canvas.width;
            this.height = globalUtil.canvas.height;
        }
        else
        {
            this.width = parent.width;
            this.height = parent.height;
        }
    }

    initCfg(cfg)
    {
        if (cfg.routes)
        {
            let rCfg;
            for (let name in cfg.routes)
            {
                rCfg = cfg.routes[name];
                this.initChildrenCfg(rCfg.view);
            }
        }
    }

    draw(ctx){
    }
}