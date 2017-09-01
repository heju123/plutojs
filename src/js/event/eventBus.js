/**
 * Created by heju on 2017/7/25.
 */
import EventListener from "./eventListener.js";
import ClickEvent from "./type/clickEvent.js";
import MouseEvent from "./type/mouseEvent.js";
import KeyEvent from "./type/keyEvent.js";
import Stack from "../data/structure/stack.js";
import EventNotify from "./eventNotify.js";
import globalUtil from "../util/globalUtil";
import commonUtil from "../util/commonUtil";

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

        this.addEventListener(this.canvas, "mousewheel", (e)=>{
            console.log(e);
        });
        this.addEventListener(this.canvas, "DOMMouseScroll", (e)=>{
            console.log(e);
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
            let eventListeners = this.eventListeners[type];
            if (eventListeners.length > 0)
            {
                let listener;
                for (let i = eventListeners.length - 1; i >=0; i--)
                {
                    listener = eventListeners[i];
                    if (listener.target.isViewState || listener.target.active)
                    {
                        eventNotify = new EventNotify();
                        eventNotify.set({
                            batchNo: batchNo,
                            type: 1,
                            px: px,
                            py: py,
                            listener: listener
                        });
                        listener.setSourceEvent(e);
                        listener.target.addEventNotify(eventNotify);
                    }
                }
            }
        });
    }

    createKeyEventNotify(e, type){
        e = e || window.event;
        let batchNo = this.createPropagationStack();
        let eventNotify;
        this.eventNotifyQueue.push(()=>{
            this.eventListeners[type].forEach((listener)=>{
                if (listener.target.isViewState || listener.target.active)
                {
                    eventNotify = new EventNotify();
                    eventNotify.set({
                        batchNo : batchNo,
                        type : 2,
                        listener : listener
                    });
                    listener.setSourceEvent(e);
                    listener.target.addEventNotify(eventNotify);
                }
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
        if (!this.propagationEventQueue[eventNotify.batchNo])
        {
            return;
        }
        this.propagationEventQueue[eventNotify.batchNo].push(eventNotify.listener);
    }

    /**
     * 冒泡执行事件
     */
    propagationEvent(){
        let listener;
        let bubble;//上一个冒泡节点
        let target;
        let event;
        let top;
        let key;
        for (key in this.propagationEventQueue)
        {
            bubble = undefined;
            target = undefined;
            event = undefined;
            top = this.propagationEventQueue[key].getTop();
            if (top)//获取target，第一个冒泡节点的target
            {
                target = top.target;
            }
            while (listener = this.propagationEventQueue[key].pop())
            {
                if (listener.target.isViewState || !bubble//viewstate节点或第一个节点
                    || (event && event.immediatePropagation && bubble === listener.target)//自己
                    || (event && event.propagation && listener.target.parentOf(bubble)))//parent
                {
                    event = this.getEvent(listener);
                    event.setTarget(target);
                    if (listener.callback && typeof(listener.callback) === "function")
                    {
                        listener.callback(event);
                    }
                    bubble = listener.target;
                }
            }
            delete this.propagationEventQueue[key];
        }
    }

    getEvent(listener){
        let event;
        switch (listener.type)
        {
            case "click" :
                event = new ClickEvent(listener.type);
                event.setCurrentTarget(listener.target);
                break;
            case "mousedown" :
                event = new MouseEvent(listener.type);
                event.setCurrentTarget(listener.target);
                event.setButton(listener.sourceEvent.button);
                event.setPageX(listener.sourceEvent.pageX);
                event.setPageY(listener.sourceEvent.pageY);
                break;
            case "mousemove" :
                event = new MouseEvent(listener.type);
                event.setCurrentTarget(listener.target);
                event.setPageX(listener.sourceEvent.pageX);
                event.setPageY(listener.sourceEvent.pageY);
                break;
            case "mouseup" :
                event = new MouseEvent(listener.type);
                event.setCurrentTarget(listener.target);
                event.setButton(listener.sourceEvent.button);
                event.setPageX(listener.sourceEvent.pageX);
                event.setPageY(listener.sourceEvent.pageY);
                break;
            case "keydown" :
                event = new KeyEvent(listener.type);
                event.setCurrentTarget(listener.target);
                event.setKey(listener.sourceEvent.key);
                event.setKeyCode(listener.sourceEvent.keyCode);
                break;
            case "keyup" :
                event = new KeyEvent(listener.type);
                event.setCurrentTarget(listener.target);
                event.setKey(listener.sourceEvent.key);
                event.setKeyCode(listener.sourceEvent.keyCode);
                break;
            default : break;
        }
        return event;
    }

    /** 注册事件 */
    registerEvent(com, type, callback){
        let listener = this.getEventListener(com, type, callback);
        this.eventListeners[type].push(listener);
        return listener;
    }

    getEventListener(target, type, callback){
       let eventListener = new EventListener(type, callback);
       eventListener.setTarget(target);
       return eventListener;
    }
}