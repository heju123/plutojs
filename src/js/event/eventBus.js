/**
 * Created by heju on 2017/7/25.
 */
import ClickEvent from "./type/clickEvent.js";
import MouseEvent from "./type/mouseEvent.js";
import KeyEvent from "./type/keyEvent.js";
import Stack from "../data/structure/stack.js";

export default class EventBus{
    constructor(canvas){
        this.canvas = canvas;
        //注册事件列表
        this.eventListeners = {
            "click" : [],
            "mousemove" : [],
            "keydown" : []
        };
        //事件通知方法
        this.eventNotifyFun = undefined;
        //事件执行堆栈（实现冒泡）
        this.propagationEventStack = new Stack();

        this.initDomEvent();
    }

    initDomEvent(){
        if (window.addEventListener)
        {
            this.canvas.addEventListener("click", (e)=>{
                this.createEventNotify(e, "click");
            }, false);

            this.canvas.addEventListener("mousemove", (e)=>{
                this.createEventNotify(e, "mousemove");
            }, false);

            window.addEventListener("keydown", (e)=>{
                this.createKeyEventNotify(e, "keydown");
            }, false);
        }
        else
        {
            this.canvas.attachEvent("onclick", (e)=>{
                this.createEventNotify(e, "click");
            });

            this.canvas.attachEvent("onmousemove", (e)=>{
                this.createEventNotify(e, "mousemove");
            });

            window.attachEvent("onkeydown", (e)=>{
                this.createKeyEventNotify(e, "keydown");
            });
        }
    }

    createEventNotify(e, type){
        e = e || window.event;
        let px = e.pageX;
        let py = e.pageY;
        this.eventNotifyFun = ()=>{
            this.eventListeners[type].forEach((event)=>{
                event.target.eventNotify.set({
                    type : 1,
                    px : px,
                    py : py,
                    event : event
                });
                event.setSourceEvent(e);
            });
        };
    }

    createKeyEventNotify(e, type){
        e = e || window.event;
        this.eventNotifyFun = ()=>{
            this.eventListeners[type].forEach((event)=>{
                event.target.eventNotify.set({
                    type : 2,
                    event : event
                });
                event.setSourceEvent(e);
            });
        };
    }

    //通知触发事件
    doNotifyEvent(){
        if (this.eventNotifyFun && typeof(this.eventNotifyFun) == "function")
        {
            this.eventNotifyFun();
            this.eventNotifyFun = undefined;
        }
    }

    //捕获事件
    captureEvent(eventNotify){
        if (eventNotify.event instanceof MouseEvent)
        {
            eventNotify.event.setPageX(eventNotify.event.sourceEvent.pageX);
            eventNotify.event.setPageY(eventNotify.event.sourceEvent.pageY);
            eventNotify.event.setButton(eventNotify.event.sourceEvent.button);
        }
        if (eventNotify.event instanceof KeyEvent)
        {
            eventNotify.event.setKey(eventNotify.event.sourceEvent.key);
            eventNotify.event.setKeyCode(eventNotify.event.sourceEvent.keyCode);
        }
        this.propagationEventStack.push(eventNotify.event);
    }

    //冒泡执行事件
    propagationEvent(){
        let event;
        while (event = this.propagationEventStack.pop())
        {
            if (event.callback && typeof(event.callback) === "function")
            {
                event.callback.apply(event, [event]);
            }
        }
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
            case "mousemove" :
                event = new MouseEvent(type, callback);
                event.setTarget(com);
                this.eventListeners.mousemove.push(event);
                break;
            case "keydown" :
                event = new KeyEvent(type, callback);
                event.setTarget(com);
                this.eventListeners.keydown.push(event);
                break;
            default : break;
        }
        return event;
    }
}