/**
 * Created by heju on 2017/7/20.
 */
import globalUtil from "../../util/globalUtil.js";
import Panel from "./panel.js";

export default class Component {
    constructor(parent) {
        this.parent = parent;
        this.eventNotifys = [];//事件通知队列
    }

    initCfg(cfg){
        if (cfg.style)
        {
            this.x = cfg.style.x;
            this.y = cfg.style.y;
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
                        this.registerEvent(type, controller[funName].bind(this, param));
                    }
                    else
                    {
                        this.registerEvent(type, controller[funName].bind(this));
                    }
                }
            }
        }
    }

    draw(ctx){
        this.eventNotifys.forEach((eventNotify)=>{
            this.checkEvent(eventNotify);
        });
        this.eventNotifys.length = 0;
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
            return com.x + this.getRealX(com.parent);
        }
        else
        {
            return com.x;
        }
    }
    getRealY(com){
        if (com.parent)
        {
            return com.y + this.getRealY(com.parent);
        }
        else{
            return com.y;
        }
    }

    registerEvent(eventType, callback){
        globalUtil.eventBus.registerEvent(this, eventType, callback);
    }

    addEventNotify(eventNotify){
        this.eventNotifys.push(eventNotify);
    }
}