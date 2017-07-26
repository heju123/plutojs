/**
 * Created by heju on 2017/7/20.
 */
import globalUtil from "../../util/globalUtil.js";
import EventNotify from "../../event/eventNotify.js";

export default class Component {
    constructor(cfg) {
        this.x = cfg.style.x;
        this.y = cfg.style.y;
        this.eventNotify = new EventNotify();
    }

    draw(ctx){
        if (this.eventNotify.type)
        {
            if (this.eventNotify.type === 1
                && this.isPointInComponent(this.eventNotify.px, this.eventNotify.py))//判断鼠标是否在控件范围内
            {
                globalUtil.eventBus.captureEvent(this.eventNotify);
            }
            else if (this.eventNotify.type === 2)//键盘事件
            {
                globalUtil.eventBus.captureEvent(this.eventNotify);
            }
            this.eventNotify.clearEventNotify();
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
}