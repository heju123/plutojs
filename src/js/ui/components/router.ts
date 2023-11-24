import globalUtil from "../../util/globalUtil";
import Rect from "./rect";
import Component from "./component";
import ViewState from "../viewState";

export default class Router extends Rect{
    private currentChildren : Component;
    private routes : any;
    private currentRoute : string;

    constructor(parent? : Component | ViewState){
        super(parent);

        //routes对象结构：每个name下面包含loader：子节点的配置文件；isLoaded：当前路由资源是否加载
        this.routes = {};
        this.children = [];

        this.setX(0);
        this.setY(0);
        if (!parent)//最顶层
        {
            this.setWidth(this.viewState.getWidth());
            this.setHeight(this.viewState.getHeight());
        }
        else
        {
            this.setWidth("100%");
            this.setHeight("100%");
        }
    }

    initCfg(cfg : any) : Promise<any>
    {
        let allPromise = [];
        let promise = super.initCfg(cfg);
        if (promise)
        {
            allPromise.push(promise);
        }

        if (cfg.routes)
        {
            let rCfg;
            for (let name in cfg.routes)
            {
                rCfg = cfg.routes[name];
                this.routes[name] = {
                    loader : rCfg.view,
                    isLoaded : false
                };
                if (rCfg.default)
                {
                    this.currentRoute = name;
                    allPromise.push(this.getChildrenView());
                }
            }
        }
        return Promise.all(allPromise);
    }

    draw(ctx : CanvasRenderingContext2D){
        if (!super.draw(ctx)) {
            return false;
        }

        return true;
    }

    private getChildrenView() : Promise<any>{
        return new Promise((resolve)=>{
            if (!this.currentChildren)
            {
                if (this.routes[this.currentRoute].isLoaded === false)//未加载资源
                {
                    let retPromise = this.produceChildrenByCfg(this.routes[this.currentRoute].loader);
                    retPromise.then((child)=>{
                        this.currentChildren = child;
                        this.currentChildren.name = this.currentRoute;
                        this.currentChildren.active = true;
                        this.routes[this.currentRoute].isLoaded = true;

                        //广播视图加载完毕事件
                        let event = {
                            currentTarget : child
                        };
                        globalUtil.eventBus.broadcastEvent("$onViewLoaded", event, true);

                        resolve(undefined);
                    });
                }
                else
                {
                    this.children.forEach((child)=>{
                        if (child.name === this.currentRoute)
                        {
                            this.currentChildren = child;
                        }
                    });
                    this.currentChildren.active = true;
                    resolve(undefined);
                }
            }
            else
            {
                resolve(undefined);
            }
        });
    }

    getChildren() : Array<Component> | Component{
        return this.currentChildren;
    }

    /** 切换route
     *
     * @param name 要切换route的name
     * @param destory 是否销毁之前的route
     */
    changeRoute(name : string, destory? : boolean){
        if (destory === undefined)
        {
            destory = true;
        }
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

    destroyRoute(name : string){
        let cindex = -1;
        this.children.forEach((child, index)=>{
            if (child.name === name)
            {
                cindex = index;
                child.destroy();
            }
        });
        if (cindex > -1)
        {
            this.children.splice(cindex, 1);
            this.routes[name].isLoaded = false;
        }
    }
}