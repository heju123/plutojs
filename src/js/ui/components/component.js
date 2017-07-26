/**
 * Created by heju on 2017/7/20.
 */
import globalUtil from "../../util/globalUtil.js";

export default class Component {
    constructor(cfg) {
        this.x = cfg.style.x;
        this.y = cfg.style.y;
        this.eventNotifys = [];//事件通知队列
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