/**
 * Created by heju on 2017/7/19.
 */
import globalUtil from "../util/globalUtil.js";
import commonUtil from "../util/commonUtil.js";
import Rect from "./components/rect.js";
import Router from "./components/router.js";
import Input from "./components/input.js";

export default class ViewState{
    constructor(canvas, ctx){
        this.ctx = ctx;
        this.canvas = canvas;

        this.isViewState = true;

        this.defaultFontFamily = "Microsoft YaHei";
        this.defaultFontSize = "14px";
        this.defaultFontColor = "#333";

        this.ctx.mouseAction = {};

        this.registerEvent("mousedown", (e)=>{
            if (e.sourceEvent.target !== this.canvas)
            {
                return;
            }
            if (globalUtil.action.hoverComponent)
            {
                if (globalUtil.action.focusComponent)
                {
                    globalUtil.action.focusComponent.onFocusout();
                }
                globalUtil.action.focusComponent = globalUtil.action.hoverComponent;
                if (globalUtil.action.focusComponent.onFocus && typeof(globalUtil.action.focusComponent.onFocus) === "function")
                {
                    globalUtil.action.focusComponent.onFocus(e.pageX, e.pageY);
                }

                globalUtil.action.activeComponent = globalUtil.action.hoverComponent;
                globalUtil.action.activeComponent.onActive(e.pageX, e.pageY);

                //是否支持拖动
                if (e.button === 0)//只能左键拖动
                {
                    globalUtil.action.dragComponent = globalUtil.action.hoverComponent.getDragComponent(globalUtil.action.hoverComponent);
                    if (globalUtil.action.dragComponent)
                    {
                        globalUtil.action.dragOffset = {
                            x : e.pageX - globalUtil.action.dragComponent.getRealX(),
                            y : e.pageY - globalUtil.action.dragComponent.getRealY()
                        };
                    }
                }
            }
        });
        this.registerEvent("mouseup", (e)=>{
            if (e.sourceEvent.target !== this.canvas)
            {
                return;
            }
            globalUtil.action.inputListenerDom.focus();
            if (globalUtil.action.activeComponent)
            {
                globalUtil.action.activeComponent.onActiveout();
                globalUtil.action.activeComponent = undefined;
            }
            if (globalUtil.action.dragComponent)
            {
                globalUtil.action.dragComponent = undefined;
                globalUtil.action.dragOffset = undefined;
            }
        });
        this.registerEvent("mousemove", (e)=>{
            if (e.sourceEvent.target !== this.canvas)
            {
                return;
            }
            this.ctx.mouseAction.mx = e.pageX - this.ctx.canvasOffset.left;
            this.ctx.mouseAction.my = e.pageY - this.ctx.canvasOffset.top;

            if (globalUtil.action.dragComponent)//拖动
            {
                globalUtil.action.dragComponent.setRealX(e.pageX - globalUtil.action.dragOffset.x);
                globalUtil.action.dragComponent.setRealY(e.pageY - globalUtil.action.dragOffset.y);
            }
        });

        //输入框事件
        globalUtil.action.inputListenerDom.compositionMode = false;//是否输入法状态
        globalUtil.eventBus.addEventListener(globalUtil.action.inputListenerDom, "compositionstart", (e)=>{
            globalUtil.action.inputListenerDom.compositionMode = true;
        });
        globalUtil.eventBus.addEventListener(globalUtil.action.inputListenerDom, "compositionend", (e)=>{
            globalUtil.action.inputListenerDom.compositionMode = false;
            if (globalUtil.action.focusComponent && globalUtil.action.focusComponent instanceof Input)
            {
                this.setVal2FocusCom();
            }
        });
        globalUtil.eventBus.addEventListener(globalUtil.action.inputListenerDom, "input", (e)=>{
            if (!globalUtil.action.inputListenerDom.compositionMode
                && globalUtil.action.focusComponent && globalUtil.action.focusComponent instanceof Input)
            {
                this.setVal2FocusCom();
            }
        });
    }

    init(viewCfg){
        if (viewCfg.type == "rect")
        {
            this.rootComponent = new Rect();
        }
        else if (viewCfg.type == "route")
        {
            this.rootComponent = new Router();
        }
        this.rootComponent.initCfg(viewCfg).then(()=>{
            globalUtil.eventBus.broadcastEvent("$onViewLoaded");//view加载完成事件（所有同步加载的视图加载完毕）
        });
    }

    /** 绘制前 */
    beforeDraw(ctx){
        //通知触发事件
        globalUtil.eventBus.doNotifyEvent();

        ctx.mouseAction.hoverCom = undefined;
    }

    /** 绘制后 */
    afterDraw(ctx){
        globalUtil.eventBus.propagationEvent();

        //全部绘制完后检查hover的组件，并且上一次hover的组件和这一次的不能相同
        if (ctx.mouseAction.hoverCom)
        {
            //这一次hover的组件不等于上一次hover的组件，则表示上一次hover的组件hoverout了
            if (globalUtil.action.hoverComponent !== ctx.mouseAction.hoverCom)
            {
                if (globalUtil.action.hoverComponent)
                {
                    globalUtil.action.hoverComponent.onHoverout();
                }
                globalUtil.action.hoverComponent = ctx.mouseAction.hoverCom;
                globalUtil.action.hoverComponent.onHover();
            }
        }
    }

    /** 将textarea中的值设置到焦点组件 */
    setVal2FocusCom(){
        if (!globalUtil.action.focusComponent.style.readOnly)//readOnly时禁止输入
        {
            globalUtil.action.focusComponent.setText(globalUtil.action.inputListenerDom.value);
            globalUtil.action.inputListenerDom.text = globalUtil.action.focusComponent.getText() || "";
        }
    }

    addEventNotify(eventNotify){
        globalUtil.eventBus.captureEvent(eventNotify);//为了最后执行mousedown事件，必须第一个占坑
    }

    getComponentInChildrenByKey(key, val, com) {
        let children = com.getChildren();
        if (children)
        {
            let retCom;
            if (children instanceof Array)
            {
                let child;
                for (let i = 0, j = children.length; i < j; i++)
                {
                    child = children[i];
                    if (child[key] && child[key] === val)
                    {
                        return child;
                    }
                    retCom = this.getComponentInChildrenByKey(key, val, child);
                    if (retCom)
                    {
                        return retCom;
                    }
                    if (i == j - 1)
                    {
                        return undefined;
                    }
                }
            }
            else
            {
                if (children[key] && children[key] === val)
                {
                    return children;
                }
                else
                {
                    return this.getComponentInChildrenByKey(key, val, children);
                }
            }
        }
        else
        {
            return undefined;
        }
    }

    _getComponentsInChildrenByKey(retArr, key, val, com) {
        let children = com.getChildren();
        if (children)
        {
            if (children instanceof Array)
            {
                let child;
                for (let i = 0, j = children.length; i < j; i++)
                {
                    child = children[i];
                    if (child[key] && child[key] === val)
                    {
                        retArr.push(child);
                    }
                    this._getComponentsInChildrenByKey(retArr, key, val, child);
                }
            }
            else
            {
                if (children[key] && children[key] === val)
                {
                    retArr.push([children]);
                }
                else
                {
                    this._getComponentsInChildrenByKey(retArr, key, val, children);
                }
            }
        }
    }
    /** 用key获取组件列表 */
    getComponentsInChildrenByKey(key, val, com) {
        let retArr = [];
        this._getComponentsInChildrenByKey(retArr, key, val, com);
        return retArr;
    }

    getComponentById(id){
        if (this.rootComponent.id && this.rootComponent.id === id)
        {
            return this.rootComponent;
        }
        else
        {
            return this.getComponentInChildrenByKey("id", id, this.rootComponent);
        }
    }

    getComponentByName(name){
        if (this.rootComponent.name && this.rootComponent.name === name)
        {
            return this.rootComponent;
        }
        else
        {
            return globalUtil.viewState.getComponentInChildrenByKey("name", name, this.rootComponent);
        }
    }

    /** 用name获取组件集合 */
    getComponentsByName(name){
        if (this.rootComponent.name && this.rootComponent.name === name)
        {
            return [this.rootComponent];
        }
        else
        {
            return this.getComponentsInChildrenByKey("name", name, this.rootComponent);
        }
    }

    /** 用type获取组件集合 */
    getComponentsByType(type){
        if (this.rootComponent.type && this.rootComponent.type === type)
        {
            return [this.rootComponent];
        }
        else
        {
            return this.getComponentsInChildrenByKey("type", type, this.rootComponent);
        }
    }

    getWidth(){
        return this.ctx.canvas.width;
    }

    getHeight(){
        return this.ctx.canvas.height;
    }

    registerEvent(eventType, callback){
        globalUtil.eventBus.registerEvent(this, eventType, callback);
    }

    removeEvent(eventType, callback){
        globalUtil.eventBus.removeEvent(this, eventType, callback);
    }

    removeAllEvent()
    {
        globalUtil.eventBus.removeAllEvent(this);
    }
}