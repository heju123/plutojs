import globalUtil from "../../util/globalUtil.js";
import Rect from "./rect.js";

export default class Router extends Rect{
    constructor(parent){
        super(parent);

        this.routes = {};
        this.children = [];

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

    initCfg(cfg)
    {
        super.initCfg(cfg);

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
                    this.currentRoute = name;
                    this.getChildrenView();
                }
            }
        }
    }

    draw(ctx){
        if (!super.draw(ctx)) {
            return false;
        }

        return true;
    }

    getChildrenView(){
        if (!this.currentChildren)
        {
            if (this.routes[this.currentRoute].num === undefined)
            {
                let retChild = this.produceChildrenByCfg(this.routes[this.currentRoute].loader);
                if (retChild instanceof Promise)
                {
                    retChild.then((child)=>{
                        this.routes[this.currentRoute].num = this.children.length - 1;
                        this.currentChildren = child;
                        this.currentChildren.active = true;
                    });
                }
                else
                {
                    this.routes[this.currentRoute].num = this.children.length - 1;
                    this.currentChildren = retChild;
                    this.currentChildren.active = true;
                }
            }
            else
            {
                this.currentChildren = this.children[this.routes[this.currentRoute].num];
                this.currentChildren.active = true;
            }
        }
    }

    getChildren(){
        return this.currentChildren;
    }

    changeRoute(name){
        if (this.currentChildren)
        {
            this.currentChildren.active = false;
        }
        this.currentRoute = name;
        this.currentChildren = undefined;
        this.getChildrenView();
    }
}