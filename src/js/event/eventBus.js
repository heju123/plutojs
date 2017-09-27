/**
 * Created by heju on 2017/7/25.
 */
import EventListener from "./eventListener.js";
import ClickEvent from "./type/clickEvent.js";
import MouseEvent from "./type/mouseEvent.js";
import KeyEvent from "./type/keyEvent.js";
import WheelEvent from "./type/wheelEvent.js";
import Stack from "../data/structure/stack.js";
import EventNotify from "./eventNotify.js";
import globalUtil from "../util/globalUtil";
import commonUtil from "../util/commonUtil";

export default class EventBus{
    constructor(canvas){
        this.canvas = canvas;
        //注册事件列表
        this.eventListeners = {};
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
            this.createOtherEventNotify(e, "keydown", 2);
        });

        this.addEventListener(window, "keyup", (e)=>{
            this.createOtherEventNotify(e, "keyup", 2);
        });

        this.addEventListener(this.canvas, "DOMMouseScroll", (e)=>{
            this.createOtherEventNotify(e, "mousewheel", 3);
        });
        this.addEventListener(this.canvas, "mousewheel", (e)=>{
            this.createOtherEventNotify(e, "mousewheel", 3);
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

    /** 创建鼠标事件通知 */
    createEventNotify(e, type){
        if (!this.eventListeners[type])
        {
            return;
        }
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
                            sourceEvent : e,
                            listener: listener
                        });
                        listener.target.addEventNotify(eventNotify);
                    }
                }
            }
        });
    }

    /** 创建非鼠标事件通知 */
    createOtherEventNotify(e, type, ntype){
        if (!this.eventListeners[type])
        {
            return;
        }
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
                        type : ntype,
                        sourceEvent : e,
                        listener : listener
                    });
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
        this.propagationEventQueue[eventNotify.batchNo].push(eventNotify);
    }

    /**
     * 冒泡执行事件
     */
    propagationEvent(){
        let eventNotify;
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
                target = top.listener.target;
            }
            while (eventNotify = this.propagationEventQueue[key].pop())
            {
                if (eventNotify.listener.target.isViewState || !bubble//viewstate节点或第一个节点
                    || (event && event.immediatePropagation && bubble === eventNotify.listener.target)//自己
                    || (event && event.propagation && eventNotify.listener.target.parentOf(bubble)))//parent
                {
                    event = this.getEvent(eventNotify);
                    event.setTarget(target);
                    if (eventNotify.listener.callback && typeof(eventNotify.listener.callback) === "function")
                    {
                        eventNotify.listener.callback(event);
                    }
                    bubble = eventNotify.listener.target;
                }
            }
            delete this.propagationEventQueue[key];
        }
    }

    getEvent(eventNotify){
        let event;
        switch (eventNotify.listener.type)
        {
            case "click" :
                event = new ClickEvent(eventNotify.listener.type);
                event.setCurrentTarget(eventNotify.listener.target);
                break;
            case "mousedown" :
                event = new MouseEvent(eventNotify.listener.type);
                event.setCurrentTarget(eventNotify.listener.target);
                event.setButton(eventNotify.sourceEvent.button);
                event.setPageX(eventNotify.sourceEvent.pageX);
                event.setPageY(eventNotify.sourceEvent.pageY);
                break;
            case "mousemove" :
                event = new MouseEvent(eventNotify.listener.type);
                event.setCurrentTarget(eventNotify.listener.target);
                event.setPageX(eventNotify.sourceEvent.pageX);
                event.setPageY(eventNotify.sourceEvent.pageY);
                break;
            case "mouseup" :
                event = new MouseEvent(eventNotify.listener.type);
                event.setCurrentTarget(eventNotify.listener.target);
                event.setButton(eventNotify.sourceEvent.button);
                event.setPageX(eventNotify.sourceEvent.pageX);
                event.setPageY(eventNotify.sourceEvent.pageY);
                break;
            case "keydown" :
                event = new KeyEvent(eventNotify.listener.type);
                event.setCurrentTarget(eventNotify.listener.target);
                event.setKey(eventNotify.sourceEvent.key);
                event.setKeyCode(eventNotify.sourceEvent.keyCode);
                break;
            case "keyup" :
                event = new KeyEvent(eventNotify.listener.type);
                event.setCurrentTarget(eventNotify.listener.target);
                event.setKey(eventNotify.sourceEvent.key);
                event.setKeyCode(eventNotify.sourceEvent.keyCode);
                break;
            case "mousewheel" :
                event = new WheelEvent(eventNotify.listener.type);
                event.setCurrentTarget(eventNotify.listener.target);
                event.setWheelDelta(eventNotify.sourceEvent.wheelDelta || -eventNotify.sourceEvent.detail);
                break;
            default : break;
        }
        return event;
    }

    /** 广播事件 */
    broadcastEvent(type, event){
        if (!this.eventListeners[type])
        {
            return;
        }
        this.eventListeners[type].forEach((listener)=>{
            if (listener.callback && typeof(listener.callback) === "function")
            {
                listener.callback(event);
            }
        });
    }

    /** 注册事件 */
    registerEvent(com, type, callback){
        let listener = this.getEventListener(com, type, callback);
        if (!this.eventListeners[type])
        {
            this.eventListeners[type] = [];
        }
        this.eventListeners[type].push(listener);
        return listener;
    }

    /**
     * 移除事件
     *
     * @param callback 如果callback不传，则删除所有type类型的事件
     */
    removeEvent(com, type, callback){
        if (!com || !type || !this.eventListeners[type])
        {
            return;
        }
        let listener;
        for (let i = 0; i < this.eventListeners[type].length; i++)
        {
            listener = this.eventListeners[type][i];
            if (listener.target === com && (!callback || listener.callback === callback))
            {
                this.eventListeners[type].splice(i, 1);
                i--;
            }
        }
        if (this.eventListeners[type].length === 0)//监听列表为空，则清掉避免浪费空间
        {
            delete this.eventListeners[type];
        }
    }

    removeAllEvent(com){
        for (let type in this.eventListeners)
        {
            this.removeEvent(com, type);
        }
    }

    getEventListener(target, type, callback){
       let eventListener = new EventListener(type, callback);
       eventListener.setTarget(target);
       return eventListener;
    }
}