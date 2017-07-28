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
        this.children = [];
    }

    initCfg(cfg)
    {
        if (cfg.routes)
        {
            let rCfg;
            for (let name in cfg.routes)
            {
                rCfg = cfg.routes[name];
                this.routes[name] = {
                    loader : rCfg.view
                };
                if (rCfg.default)
                {
                    this.routes[name].num = 0;
                    this.currentRoute = name;
                    this.getChildrenView();
                }
            }
        }

        super.initCfg(cfg);
    }

    getChildrenView(){
        if (!this.currentChildren)
        {
            if (!this.routes[this.currentRoute].num)
            {
                let retChild = this.produceChildren(this.routes[this.currentRoute].loader);
                if (retChild instanceof Promise)
                {
                    retChild.then((child)=>{
                        this.routes[this.currentRoute].num = this.children.length - 1;
                        this.currentChildren = child;
                    });
                }
                else
                {
                    this.routes[this.currentRoute].num = this.children.length - 1;
                    this.currentChildren = retChild;
                }
            }
            else
            {
                this.currentChildren = this.children[this.routes[this.currentRoute].num];
            }
        }
    }

    getChildren(){
        return this.currentChildren;
    }

    changeRoute(name){
        this.currentRoute = name;
        this.currentChildren = undefined;
        this.getChildrenView();
    }
}