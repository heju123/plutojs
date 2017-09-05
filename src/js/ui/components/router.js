import globalUtil from "../../util/globalUtil.js";
import Rect from "./rect.js";

export default class Router extends Rect{
    constructor(parent){
        super(parent);

        //routes对象结构：每个name下面包含num：标识子节点在children数组中的位置；loader：子节点的配置文件
        this.routes = {};
        this.children = [];

        this.setX(0);
        this.setY(0);
        if (!parent)//最顶层
        {
            this.setWidth(globalUtil.viewState.getWidth());
            this.setHeight(globalUtil.viewState.getHeight());
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

    /** 切换route
     *
     * @param name 要切换route的name
     * @param destory 是否销毁之前的route
     */
    changeRoute(name, destory){
        if (this.currentChildren)
        {
            this.currentChildren.active = false;
        }
        if (destory)
        {
            this.destroyRoute(this.currentRoute);
        }
        this.currentRoute = name;
        this.currentChildren = undefined;
        this.getChildrenView();
    }

    destroyRoute(name){
        this.currentChildren.destroy();
        this.children.splice(this.routes[name].num, 1);
        this.routes[name].num = undefined;
    }
}