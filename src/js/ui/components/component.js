/**
 * Created by heju on 2017/7/20.
 */
import globalUtil from "../../util/globalUtil.js";
import Panel from "./panel.js";

export default class Component {
    constructor(parent) {
        this.parent = parent;
        this.eventNotifys = [];//事件通知队列
        this.active = true;//为false则不绘制
    }

    initCfg(cfg){
        if (cfg.id)
        {
            this.id = cfg.id;
        }
        if (cfg.style)
        {
            this.style = cfg.style;
        }

        //事件绑定配置
        if (cfg.events)
        {
            let eventInfo;
            let funName;
            let param;
            let controller;
            for (let type in cfg.events)
            {
                eventInfo = cfg.events[type];
                if (typeof(eventInfo) == "object")
                {
                    funName = eventInfo.callback;
                    if (eventInfo.param)//有参数
                    {
                        param = eventInfo.param.apply(this, [this]);
                    }
                }
                else
                {
                    funName = eventInfo;
                }
                controller = this.getController(this);
                if (controller && controller[funName]
                    && typeof(controller[funName]) == "function")
                {
                    if (param)
                    {
                        this.registerEvent(type, controller[funName].bind(controller, param));
                    }
                    else
                    {
                        this.registerEvent(type, controller[funName].bind(controller));
                    }
                }
            }
        }
    }

    initChildrenCfg(childrenCfg){
        this.children = [];
        if (typeof(childrenCfg) == "object" && childrenCfg instanceof Array)
        {
            let chiCfg;
            for (let i = 0, j = childrenCfg.length; i < j; i++)
            {
                chiCfg = childrenCfg[i];
                this.produceChildren(chiCfg);
            }
        }
        else
        {
            this.produceChildren(childrenCfg);
        }
    }

    produceChildren(chiCfg){
        let Rect = require("./rect.js").default;
        let Input = require("./input.js").default;
        let Button = require("./button.js").default;

        let childCom;
        if (typeof(chiCfg) === "function")//异步加载view
        {
            return chiCfg(this.asyncGetView.bind(this));
        }
        else
        {
            switch (chiCfg.type)
            {
                case "panel" :
                    childCom = new Panel(this);
                    childCom.initCfg(chiCfg);
                    this.children.push(childCom);
                    break;
                case "rect" :
                    childCom = new Rect(this);
                    childCom.initCfg(chiCfg);
                    this.children.push(childCom);
                    break;
                case "input" :
                    childCom = new Input(this);
                    childCom.initCfg(chiCfg);
                    this.children.push(childCom);
                    break;
                default : break;
            }
            return childCom;
        }
    }

    asyncGetView(viewCfg, resolve, reject){
        let panel = new Panel(this);
        panel.initCfg(viewCfg);
        this.children.push(panel);
        if (resolve)
        {
            resolve(panel);
        }
    }

    draw(ctx){
        //不在parent范围内，则不需要绘制
        let parentArea = this.inParentArea(this);
        if (parentArea === 0)
        {
            return false;
        }

        if (this.eventNotifys.length > 0)
        {
            this.eventNotifys.forEach((eventNotify)=>{
                this.checkEvent(eventNotify);
            });
            this.eventNotifys.length = 0;
        }
        return true;
    }

    /** 检查事件是否匹配 */
    checkEvent(eventNotify){
        if (eventNotify.type)
        {
            if (eventNotify.type === 1
                && this.isPointInComponent(eventNotify.px, eventNotify.py))//判断鼠标是否在控件范围内
            {
                globalUtil.eventBus.captureEvent(eventNotify);
            }
            else if (eventNotify.type === 2)//键盘事件
            {
                globalUtil.eventBus.captureEvent(eventNotify);
            }
        }
    }

    /** this是否是com的父亲 */
    parentOf(com){
        if (!com.parent)
        {
            return false;
        }
        if (com.parent === this)
        {
            return true;
        }
        return this.parentOf(com.parent);
    }

    getController(com){
        if (!com.parent)
        {
            return com.controller;
        }
        if (com instanceof Panel && com.controller)
        {
            return com.controller;
        }
        else
        {
            return this.getController(com.parent);
        }
    }

    //获取显示在界面上真实的x坐标，加上父级坐标
    getRealX(com){
        if (com.parent)
        {
            return com.style.x + this.getRealX(com.parent);
        }
        else
        {
            return com.style.x;
        }
    }
    getRealY(com){
        if (com.parent)
        {
            return com.style.y + this.getRealY(com.parent);
        }
        else{
            return com.style.y;
        }
    }

    getChildren(){
        return this.children;
    }

    registerEvent(eventType, callback){
        globalUtil.eventBus.registerEvent(this, eventType, callback);
    }

    addEventNotify(eventNotify){
        this.eventNotifys.push(eventNotify);
    }
}