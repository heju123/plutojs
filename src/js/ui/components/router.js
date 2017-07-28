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
        this.routes = {};
    }

    initCfg(cfg)
    {
        let currentIndex = -1;
        if (cfg.routes)
        {
            let childrenViews = [];
            let rCfg;
            let num = 0;
            for (let name in cfg.routes)
            {
                rCfg = cfg.routes[name];
                childrenViews.push(rCfg.view);
                this.routes[name] = num;
                if (rCfg.default)
                {
                    this.currentRoute = name;
                }
                num++;
            }
            this.initChildrenCfg(childrenViews);
        }

        if (this.children && this.children.length > 0)
        {
            this.currentChildren = this.currentRoute ? this.children[this.routes[this.currentRoute]] : this.children[0];
        }
        super.initCfg(cfg);
    }

    getChildren(){
        return this.currentChildren;
    }

    changeRoute(name){
        this.currentRoute = name;
        this.currentChildren = this.children[this.routes[this.currentRoute]];
    }
}