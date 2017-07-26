/**
 * Created by heju on 2017/7/25.
 */
import ClickEvent from "./type/clickEvent.js";
import MouseEvent from "./type/mouseEvent.js";
import KeyEvent from "./type/keyEvent.js";
import Stack from "../data/structure/stack.js";
import EventNotify from "./eventNotify.js";

export default class EventBus{
    constructor(canvas){
        this.canvas = canvas;
        //注册事件列表
        this.eventListeners = {
            "click" : [],
            "mousedown" : [],
            "mousemove" : [],
            "mouseup" : [],
            "keydown" : [],
            "keyup" : []
        };
        //事件通知队列
        this.eventNotifyQueue = [];
        //事件冒泡执行队列
        this.propagationEventQueue = {};

        this.initDomEvent();
    }

    addEventListener(dom, type, callback){
        if (window.addEventListener)
        {
            dom.addEventListener(type, callback, false);
        }
        else
        {
            dom.attachEvent("on" + type, callback);
        }
    }

    initDomEvent(){
        this.addEventListener(this.canvas, "click", (e)=>{
            this.createEventNotify(e, "click");
        });

        this.addEventListener(this.canvas, "mousedown", (e)=>{
            this.createEventNotify(e, "mousedown");
        });

        this.addEventListener(this.canvas, "mousemove", (e)=>{
            this.createEventNotify(e, "mousemove");
        });

        this.addEventListener(this.canvas, "mouseup", (e)=>{
            this.createEventNotify(e, "mouseup");
        });

        this.addEventListener(window, "keydown", (e)=>{
            this.createKeyEventNotify(e, "keydown");
        });

        this.addEventListener(window, "keyup", (e)=>{
            this.createKeyEventNotify(e, "keyup");
        });
    }

    /**
     * 创建冒泡执行堆栈，用批次号分类
     *
     * @return 批次号（时间戳）
     */
    createPropagationStack(){
        let batchNo = (new Date).getTime();
        this.propagationEventQueue[batchNo] = new Stack();
        return batchNo;
    }

    createEventNotify(e, type){
        e = e || window.event;
        let px = e.pageX;
        let py = e.pageY;
        let batchNo = this.createPropagationStack();
        let eventNotify;
        this.eventNotifyQueue.push(()=>{
            this.eventListeners[type].forEach((event)=>{
                eventNotify = new EventNotify();
                eventNotify.set({
                    batchNo : batchNo,
                    type : 1,
                    px : px,
                    py : py,
                    event : event
                });
                event.setSourceEvent(e);
                event.target.addEventNotify(eventNotify);
            });
        });
    }

    createKeyEventNotify(e, type){
        e = e || window.event;
        let batchNo = this.createPropagationStack();
        let eventNotify;
        this.eventNotifyQueue.push(()=>{
            this.eventListeners[type].forEach((event)=>{
                eventNotify = new EventNotify();
                eventNotify.set({
                    batchNo : batchNo,
                    type : 2,
                    event : event
                });
                event.setSourceEvent(e);
                event.target.addEventNotify(eventNotify);
            });
        });
    }

    //通知触发事件
    doNotifyEvent(){
        this.eventNotifyQueue.forEach((eventFun)=>{
            if (eventFun && typeof(eventFun) == "function")
            {
                eventFun();
            }
        });
        this.eventNotifyQueue.length = 0;
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
        this.propagationEventQueue[eventNotify.batchNo].push(eventNotify.event);
    }

    //冒泡执行事件
    propagationEvent(){
        for (let key in this.propagationEventQueue)
        {
            let event;
            while (event = this.propagationEventQueue[key].pop())
            {
                if (event.callback && typeof(event.callback) === "function")
                {
                    event.callback(event);
                }
            }
            delete this.propagationEventQueue[key];
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
            case "mousedown" :
                event = new MouseEvent(type, callback);
                event.setTarget(com);
                this.eventListeners.mousedown.push(event);
                break;
            case "mousemove" :
                event = new MouseEvent(type, callback);
                event.setTarget(com);
                this.eventListeners.mousemove.push(event);
                break;
            case "mouseup" :
                event = new MouseEvent(type, callback);
                event.setTarget(com);
                this.eventListeners.mouseup.push(event);
                break;
            case "keydown" :
                event = new KeyEvent(type, callback);
                event.setTarget(com);
                this.eventListeners.keydown.push(event);
                break;
            case "keyup" :
                event = new KeyEvent(type, callback);
                event.setTarget(com);
                this.eventListeners.keyup.push(event);
                break;
            default : break;
        }
        return event;
    }
}