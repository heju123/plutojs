/**
 * Created by heju on 2017/7/19.
 */
import globalUtil from "../util/globalUtil";
import commonUtil from "../util/commonUtil";
import Rect from "./components/rect";
import Router from "./components/router";
import Input from "./components/input";
import DragEvent from "../event/type/dragEvent";
import Component from "./components/component";

export default class ViewState{
    ctx : CanvasRenderingContext2D;
    canvas : HTMLCanvasElement;
    isViewState : boolean;
    defaultFontFamily : string;
    defaultFontSize : string;
    defaultFontColor : string;
    rootComponent : Component;

    constructor(canvas : HTMLCanvasElement, ctx : CanvasRenderingContext2D){
        this.ctx = ctx;
        this.canvas = canvas;

        this.isViewState = true;

        this.defaultFontFamily = "Microsoft YaHei";
        this.defaultFontSize = "14px";
        this.defaultFontColor = "#333";

        (<any>this.ctx).mouseAction = {};

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

                        let event = new DragEvent("startDrag");
                        event.setPageX(globalUtil.action.dragOffset.x);
                        event.setPageY(globalUtil.action.dragOffset.y);
                        event.setCurrentTarget(globalUtil.action.dragComponent);
                        globalUtil.eventBus.broadcastEvent("startDrag", event, true);
                    }
                }
            }
        });
        this.registerEvent("mouseup", (e)=>{
            if (e.sourceEvent.target === this.canvas)
            {
                globalUtil.action.inputListenerDom.focus();
                if (globalUtil.action.activeComponent)
                {
                    globalUtil.action.activeComponent.onActiveout();
                    globalUtil.action.activeComponent = undefined;
                }
            }
            if (globalUtil.action.dragComponent)
            {
                let event = new DragEvent("endDrag");
                event.setPageX(globalUtil.action.dragOffset.x);
                event.setPageY(globalUtil.action.dragOffset.y);
                event.setCurrentTarget(globalUtil.action.dragComponent);
                globalUtil.eventBus.broadcastEvent("endDrag", event, true);

                globalUtil.action.dragComponent = undefined;
                globalUtil.action.dragOffset = undefined;
            }
        });
        this.registerEvent("mousemove", (e)=>{
            if (e.sourceEvent.target === this.canvas)
            {
                (<any>this.ctx).mouseAction.mx = e.pageX - (<any>this.ctx).canvasOffset.left;
                (<any>this.ctx).mouseAction.my = e.pageY - (<any>this.ctx).canvasOffset.top;
            }
            if (globalUtil.action.dragComponent)//拖动
            {
                globalUtil.action.dragComponent.setRealX(e.pageX - globalUtil.action.dragOffset.x);
                globalUtil.action.dragComponent.setRealY(e.pageY - globalUtil.action.dragOffset.y);

                let event = new DragEvent("onDrag");
                event.setPageX(globalUtil.action.dragOffset.x);
                event.setPageY(globalUtil.action.dragOffset.y);
                event.setCurrentTarget(globalUtil.action.dragComponent);
                globalUtil.eventBus.broadcastEvent("onDrag", event, true);
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

    init(viewCfg : any){
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
    beforeDraw(ctx : CanvasRenderingContext2D){
        //通知触发事件
        globalUtil.eventBus.doNotifyEvent();

        (<any>ctx).mouseAction.hoverCom = undefined;
    }

    /** 绘制后 */
    afterDraw(ctx : CanvasRenderingContext2D){
        globalUtil.eventBus.propagationEvent();

        //全部绘制完后检查hover的组件，并且上一次hover的组件和这一次的不能相同
        if ((<any>ctx).mouseAction.hoverCom)
        {
            //这一次hover的组件不等于上一次hover的组件，则表示上一次hover的组件hoverout了
            if (globalUtil.action.hoverComponent !== (<any>ctx).mouseAction.hoverCom)
            {
                if (globalUtil.action.hoverComponent)
                {
                    globalUtil.action.hoverComponent.onHoverout();
                }
                globalUtil.action.hoverComponent = (<any>ctx).mouseAction.hoverCom;
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

    addEventNotify(eventNotify : any){
        globalUtil.eventBus.captureEvent(eventNotify);//为了最后执行mousedown事件，必须第一个占坑
    }

    getComponentInChildrenByKey(key : string, val : string, com : Component) {
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

    _getComponentsInChildrenByKey(retArr : Array<any>, key : string, val : string, com : Component) {
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
    getComponentsInChildrenByKey(key : string, val : string, com : Component) {
        let retArr = [];
        this._getComponentsInChildrenByKey(retArr, key, val, com);
        return retArr;
    }

    getComponentById(id : string){
        if (this.rootComponent.id && this.rootComponent.id === id)
        {
            return this.rootComponent;
        }
        else
        {
            return this.getComponentInChildrenByKey("id", id, this.rootComponent);
        }
    }

    getComponentByName(name : string){
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
    getComponentsByName(name : string){
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
    getComponentsByType(type : string){
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

    getHoverComponent(){
        return globalUtil.action.hoverComponent;
    }

    registerEvent(eventType : string, callback : Function){
        globalUtil.eventBus.registerEvent(this, eventType, callback);
    }

    removeEvent(eventType : string, callback : Function){
        globalUtil.eventBus.removeEvent(this, eventType, callback);
    }

    removeAllEvent()
    {
        globalUtil.eventBus.removeAllEvent(this);
    }
}