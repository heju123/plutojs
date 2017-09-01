/**
 * Created by heju on 2017/7/19.
 */
import globalUtil from "../util/globalUtil.js";
import commonUtil from "../util/commonUtil.js";
import Panel from "./components/panel.js";
import Router from "./components/router.js";
import Input from "./components/input.js";

export default class ViewState{
    constructor(ctx){
        this.isViewState = true;

        this.defaultFontFamily = "Microsoft YaHei";
        this.defaultFontSize = "14px";

        ctx.mouseAction = {};

        this.registerEvent("mousedown", (e)=>{
            if (globalUtil.action.hoverComponent)
            {
                globalUtil.action.focusComponent = globalUtil.action.hoverComponent;
                globalUtil.action.activeComponent = globalUtil.action.hoverComponent;
                if (globalUtil.action.focusComponent.onFocus && typeof(globalUtil.action.focusComponent.onFocus) === "function")
                {
                    globalUtil.action.focusComponent.onFocus(e.pageX, e.pageY);
                }
            }
        });
        this.registerEvent("mouseup", (e)=>{
            globalUtil.action.inputListenerDom.focus();
            if (globalUtil.action.activeComponent)
            {
                globalUtil.action.activeComponent = undefined;
            }
        });
        this.registerEvent("mousemove", (e)=>{
            ctx.mouseAction.mx = e.pageX;
            ctx.mouseAction.my = e.pageY;
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
        if (viewCfg.type == "panel")
        {
            this.rootPanel = new Panel();
            this.rootPanel.initCfg(viewCfg);
        }
        else if (viewCfg.type == "route")
        {
            this.rootPanel = new Router();
            this.rootPanel.initCfg(viewCfg);
        }
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

        //全部绘制完后检查hover的组件
        if (ctx.mouseAction.hoverCom)
        {
            globalUtil.action.hoverComponent = ctx.mouseAction.hoverCom;
        }
    }

    /** 将textarea中的值设置到焦点组件 */
    setVal2FocusCom(){
        globalUtil.action.focusComponent.setText(globalUtil.action.inputListenerDom.value);
        globalUtil.action.inputListenerDom.text = globalUtil.action.focusComponent.getText() || "";
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

    getComponentById(id){
        if (this.rootPanel.id && this.rootPanel.id === id)
        {
            return this.rootPanel;
        }
        else
        {
            return this.getComponentInChildrenByKey("id", id, this.rootPanel);
        }
    }

    registerEvent(eventType, callback){
        globalUtil.eventBus.registerEvent(this, eventType, callback);
    }
}