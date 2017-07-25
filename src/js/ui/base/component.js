/**
 * Created by heju on 2017/7/20.
 */
import globalUtil from "../../util/globalUtil.js";

export default class Component {
    constructor(cfg) {
        this.x = cfg.style.x;
        this.y = cfg.style.y;

        this.eventNotify = {
            px : undefined,
            py : undefined,
            event : undefined
        };
    }

    clearEventNotify(){
        this.eventNotify.px = undefined;
        this.eventNotify.py = undefined;
        this.eventNotify.event = undefined;
    }

    draw(ctx){
        if (this.eventNotify.px && this.eventNotify.py)
        {
            if (this.isPointInComponent(this.eventNotify.px, this.eventNotify.py))//判断鼠标是否在控件范围内
            {
                if (this.eventNotify.event && this.eventNotify.event.callback)
                {
                    this.eventNotify.event.callback.apply(this, [this.eventNotify.event]);
                    this.clearEventNotify();
                }
            }
            else
            {
                this.clearEventNotify();
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
}