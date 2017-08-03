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

        globalUtil.action = {};
        ctx.mouseAction = {};

        globalUtil.eventBus.registerEvent(this, "mousedown", (e)=>{
            if (globalUtil.action.hoverComponent)
            {
                globalUtil.action.focusComponent = globalUtil.action.hoverComponent;
                globalUtil.action.activeComponent = globalUtil.action.hoverComponent;
            }
        });
        globalUtil.eventBus.registerEvent(this, "mouseup", (e)=>{
            globalUtil.inputDom.focus();
            if (globalUtil.action.activeComponent)
            {
                globalUtil.action.activeComponent = undefined;
            }
        });
        globalUtil.eventBus.registerEvent(this, "mousemove", (e)=>{
            ctx.mouseAction.mx = e.pageX;
            ctx.mouseAction.my = e.pageY;
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

    /** 绘制前初始化hover的组件 */
    initHoverCom(ctx){
        ctx.mouseAction.hoverCom = undefined;
    }

    /** 全部绘制完后检查hover的组件 */
    checkHoverCom(ctx){
        if (ctx.mouseAction.hoverCom)
        {
            globalUtil.action.hoverComponent = ctx.mouseAction.hoverCom;
        }
    }

    addEventNotify(eventNotify){
        globalUtil.eventBus.captureEvent(eventNotify);//为了最后执行mousedown事件，必须第一个占坑
    }

    getComponentInChildrenById(id, com) {
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
                    if (child.id && child.id === id)
                    {
                        return child;
                    }
                    retCom = this.getComponentInChildrenById(id, child);
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
                if (children.id && children.id === id)
                {
                    return children;
                }
                else
                {
                    return this.getComponentInChildrenById(id, children);
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
            return this.getComponentInChildrenById(id, this.rootPanel);
        }
    }
}