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

        if (window.addEventListener)
        {
            this.canvas.addEventListener("click", (e)=>{
                this.triggerClick(e);
            }, false);
        }
        else
        {
            this.canvas.attachEvent("click", (e)=>{
                this.triggerClick(e);
            });
        }
    }

    triggerClick(e){
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