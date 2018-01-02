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
import Component from "../ui/components/component.js";
import Controller from "../ui/controller.js";

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
        // this.addEventListener(this.canvas, "click", (e)=>{
        //     this.createEventNotify(e, "click");
        // });

        let clickCom;//click的组件
        this.addEventListener(document, "mousedown", (e)=>{
            this.createEventNotify(e, "mousedown");
            if (globalUtil.action.hoverComponent)
            {
                clickCom = globalUtil.action.hoverComponent;
            }
        });

        this.addEventListener(document, "mousemove", (e)=>{
            this.createEventNotify(e, "mousemove");
        });

        this.addEventListener(document, "mouseup", (e)=>{
            this.createEventNotify(e, "mouseup");
            if (clickCom === globalUtil.action.hoverComponent)//按下和抬起必须是相同组件才触发click事件
            {
                this.createEventNotify(e, "click");
            }
            clickCom = undefined;
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
                if (eventNotify.sourceEvent)
                {
                    event.setSourceEvent(eventNotify.sourceEvent);
                }
                break;
            case "mousedown" :
                event = new MouseEvent(eventNotify.listener.type);
                event.setCurrentTarget(eventNotify.listener.target);
                if (eventNotify.sourceEvent)
                {
                    event.setButton(eventNotify.sourceEvent.button);
                    event.setPageX(eventNotify.sourceEvent.pageX);
                    event.setPageY(eventNotify.sourceEvent.pageY);
                    event.setSourceEvent(eventNotify.sourceEvent);
                }
                break;
            case "mousemove" :
                event = new MouseEvent(eventNotify.listener.type);
                event.setCurrentTarget(eventNotify.listener.target);
                if (eventNotify.sourceEvent)
                {
                    event.setPageX(eventNotify.sourceEvent.pageX);
                    event.setPageY(eventNotify.sourceEvent.pageY);
                    event.setSourceEvent(eventNotify.sourceEvent);
                }
                break;
            case "mouseup" :
                event = new MouseEvent(eventNotify.listener.type);
                event.setCurrentTarget(eventNotify.listener.target);
                if (eventNotify.sourceEvent)
                {
                    event.setButton(eventNotify.sourceEvent.button);
                    event.setPageX(eventNotify.sourceEvent.pageX);
                    event.setPageY(eventNotify.sourceEvent.pageY);
                    event.setSourceEvent(eventNotify.sourceEvent);
                }
                break;
            case "keydown" :
                event = new KeyEvent(eventNotify.listener.type);
                event.setCurrentTarget(eventNotify.listener.target);
                if (eventNotify.sourceEvent)
                {
                    event.setKey(eventNotify.sourceEvent.key);
                    event.setKeyCode(eventNotify.sourceEvent.keyCode);
                    event.setSourceEvent(eventNotify.sourceEvent);
                }
                break;
            case "keyup" :
                event = new KeyEvent(eventNotify.listener.type);
                event.setCurrentTarget(eventNotify.listener.target);
                if (eventNotify.sourceEvent)
                {
                    event.setKey(eventNotify.sourceEvent.key);
                    event.setKeyCode(eventNotify.sourceEvent.keyCode);
                    event.setSourceEvent(eventNotify.sourceEvent);
                }
                break;
            case "mousewheel" :
                event = new WheelEvent(eventNotify.listener.type);
                event.setCurrentTarget(eventNotify.listener.target);
                if (eventNotify.sourceEvent)
                {
                    event.setWheelDelta(eventNotify.sourceEvent.wheelDelta || -eventNotify.sourceEvent.detail);
                    event.setSourceEvent(eventNotify.sourceEvent);
                }
                break;
            default : break;
        }
        return event;
    }

    /**
     * 广播事件
     *
     * @param type
     * @param event 发送的事件，里面的currentTarget对象会拿来和listener.target作比较，满足条件则执行事件，currentTarget表示需要将事件推送给哪个组件
     * @param toChildren 是否发送给子组件，如果listener.target是currentTarget的children也满足条件
     */
    broadcastEvent(type, event, toChildren){
        if (!this.eventListeners[type])
        {
            return;
        }
        this.eventListeners[type].forEach((listener)=>{
            if (listener.callback && typeof(listener.callback) === "function")
            {
                //event不包含currentTarget则不需要做对象比较，直接触发事件
                if (!event || !event.currentTarget)
                {
                    listener.callback(event);
                }
                else
                {
                    //event.currentTarget和listener.target都有可能是controller，所以需要转换成component再比较
                    let currentTargetCom = this.getComponentByTarget(event.currentTarget);
                    let targetCom = this.getComponentByTarget(listener.target);
                    if (targetCom && currentTargetCom)
                    {
                        if (!toChildren && currentTargetCom === targetCom)
                        {
                            listener.callback(event);
                        }
                        else if (toChildren && (currentTargetCom === targetCom ||
                                currentTargetCom.parentOf(targetCom)))
                        {
                            listener.callback(event);
                        }
                    }
                }
            }
        });
    }

    /** 获取component
     *
     * @param target target有可能是controller，也有可能是component
     */
    getComponentByTarget(target){
        let targetCom;
        if (target instanceof Component)
        {
            targetCom = target;
        }
        else if (target instanceof Controller)
        {
            targetCom = target.component;
        }
        return targetCom;
    }

    /**
     * 触发事件
     *
     * @param type
     * @param com 绑定事件的组件
     */
    triggerEvent(type, com){
        let eventNotify = new EventNotify();
        eventNotify.set({
            type : type,
            listener : {
                type : type,
                target : com
            }
        });
        let event = this.getEvent(eventNotify);
        this.broadcastEvent(type, event);
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