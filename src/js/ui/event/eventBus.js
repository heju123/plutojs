/**
 * Created by heju on 2017/7/25.
 */
import ClickEvent from "./clickEvent.js";

export default class EventBus{
    constructor(canvas){
        this.canvas = canvas;
        //注册事件列表
        this.eventListeners = {
            "click" : []
        };
        //事件通知队列
        this.eventNotifyQueye = [];

        if (window.addEventListener)
        {
            this.canvas.addEventListener("click", (e)=>{
                this.triggerEvent(e, "click");
            }, false);
        }
        else
        {
            this.canvas.attachEvent("click", (e)=>{
                this.triggerEvent(e, "click");
            });
        }
    }

    triggerEvent(e, type){
        e = e || window.event;
        let px = e.pageX;
        let py = e.pageY;
        this.eventListeners[type].forEach((event)=>{
            this.eventNotifyQueye.push(()=>{
                event.target.eventNotify.px = px;
                event.target.eventNotify.py = py;
                event.target.eventNotify.event = event;
            });
        });
    }

    /** 注册事件 */
    registerEvent(com, type, callback){
        let event;
        switch (type)
        {
            case "click" :
                event = new ClickEvent(type, callback);
                event.setTarget(com);
                this.eventListeners.click.push(event);
                break;
            default : break;
        }
        return event;
    }
}