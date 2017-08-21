/**
 * Created by heju on 2017/7/20.
 */
import globalUtil from "../../util/globalUtil.js";
import commonUtil from "../../util/commonUtil.js";
import Panel from "./panel.js";

export default class Component {
    constructor(parent) {
        this.parent = parent;
        this.eventNotifys = [];//事件通知队列
        this.active = true;//为false则不绘制
        this.style = {};
        this.originalStyle = {};//保存原来的样式，避免focus或hover后原来的样式丢失

        this.style.fontFamily = globalUtil.viewState.defaultFontFamily;
        this.style.fontSize = globalUtil.viewState.defaultFontSize;
        this.style.lineHeight = parseInt(this.style.fontSize, 10);
        this.multiLine = true;//是否多行文本
        this.autoLine = true;//是否自动换行
    }

    initCfg(cfg){
        let $this = this;
        if (cfg.id)
        {
            this.id = cfg.id;
        }
        if (cfg.style)
        {
            commonUtil.copyObject(cfg.style, this.style, true);
        }
        this.text = this.getTextForRows(cfg.text);
        this.multiLine = cfg.multiLine || this.multiLine;

        if (this.style.backgroundImage)
        {
            let img = new Image();
            img.onload = function(){
                $this.backgroundImageDom = this;
                if (!this.getWidth() || this.getWidth() === "auto")
                {
                    $this.setWidth($this.backgroundImageDom.width);
                }
                if (!this.getHeight() || this.getHeight() === "auto")
                {
                    $this.setHeight($this.backgroundImageDom.height);
                }
            };
            img.src = this.style.backgroundImage;
        }

        //事件绑定配置
        if (cfg.events)
        {
            let eventInfo;
            let funName;
            let param;
            let controller;
            for (let type in cfg.events)
            {
                eventInfo = cfg.events[type];
                if (typeof(eventInfo) == "object")
                {
                    funName = eventInfo.callback;
                    if (eventInfo.param)//有参数
                    {
                        param = eventInfo.param.apply(this, [this]);
                    }
                }
                else
                {
                    funName = eventInfo;
                }
                controller = this.getController(this);
                if (controller && controller[funName]
                    && typeof(controller[funName]) == "function")
                {
                    if (param)
                    {
                        this.registerEvent(type, controller[funName].bind(controller, param));
                    }
                    else
                    {
                        this.registerEvent(type, controller[funName].bind(controller));
                    }
                }
            }
        }
    }

    initChildrenCfg(childrenCfg){
        this.children = [];
        if (typeof(childrenCfg) == "object" && childrenCfg instanceof Array)
        {
            let chiCfg;
            for (let i = 0, j = childrenCfg.length; i < j; i++)
            {
                chiCfg = childrenCfg[i];
                this.produceChildren(chiCfg);
            }
        }
        else
        {
            this.produceChildren(childrenCfg);
        }
    }

    produceChildren(chiCfg){
        let Rect = require("./rect.js").default;
        let Input = require("./input.js").default;
        let Button = require("./button.js").default;

        let childCom;
        if (typeof(chiCfg) === "function")//异步加载view
        {
            return chiCfg(this.asyncGetView.bind(this));
        }
        else
        {
            switch (chiCfg.type)
            {
                case "panel" :
                    childCom = new Panel(this);
                    childCom.initCfg(chiCfg);
                    this.children.push(childCom);
                    break;
                case "rect" :
                    childCom = new Rect(this);
                    childCom.initCfg(chiCfg);
                    this.children.push(childCom);
                    break;
                case "input" :
                    childCom = new Input(this);
                    childCom.initCfg(chiCfg);
                    this.children.push(childCom);
                    break;
                case "button" :
                    childCom = new Button(this);
                    childCom.initCfg(chiCfg);
                    this.children.push(childCom);
                    break;
                default : break;
            }
            return childCom;
        }
    }

    asyncGetView(viewCfg, resolve, reject){
        let panel = new Panel(this);
        panel.initCfg(viewCfg);
        this.children.push(panel);
        if (resolve)
        {
            resolve(panel);
        }
    }

    draw(ctx){
        //不在parent范围内，则不需要绘制
        let parentArea = this.inParentArea(this);
        if (parentArea === 0)
        {
            return false;
        }

        this.focusEnable();
        this.hoverEnable();
        this.activeEnable();

        //判断鼠标是否在组件范围内
        if (ctx.mouseAction.mx && ctx.mouseAction.my
            && this.isPointInComponent(ctx.mouseAction.mx, ctx.mouseAction.my))
        {
            ctx.mouseAction.hoverCom = this;
        }

        //检查事件
        if (this.eventNotifys.length > 0)
        {
            this.eventNotifys.forEach((eventNotify)=>{
                this.checkEvent(eventNotify);
            });
            this.eventNotifys.length = 0;
        }
        return true;
    }

    saveStyle(){
        commonUtil.copyObject(this.style, this.originalStyle, true);
    }

    restoreStyle(){
        commonUtil.copyObject(this.originalStyle, this.style, true);
    }

    hoverEnable(){
        if (globalUtil.action.hoverComponent === this)
        {
            commonUtil.copyObject(this.style.hover, this.style, true);
        }
    }
    focusEnable(){
        if (globalUtil.action.focusComponent === this)
        {
            commonUtil.copyObject(this.style.focus, this.style, true);
        }
    }
    activeEnable(){
        if (globalUtil.action.activeComponent === this)
        {
            commonUtil.copyObject(this.style.active, this.style, true);
        }
    }

    /** 检查事件是否匹配 */
    checkEvent(eventNotify){
        if (eventNotify.type)
        {
            if (eventNotify.type === 1
                && this.isPointInComponent(eventNotify.px, eventNotify.py))//判断鼠标是否在控件范围内
            {
                globalUtil.eventBus.captureEvent(eventNotify);
            }
            else if (eventNotify.type === 2
                && globalUtil.action.focusComponent === this)//键盘事件
            {
                globalUtil.eventBus.captureEvent(eventNotify);
            }
        }
    }

    /** this是否是com的父亲 */
    parentOf(com){
        if (!com.parent)
        {
            return false;
        }
        if (com.parent === this)
        {
            return true;
        }
        return this.parentOf(com.parent);
    }

    getController(com){
        if (!com.parent)
        {
            return com.controller;
        }
        if (com instanceof Panel && com.controller)
        {
            return com.controller;
        }
        else
        {
            return this.getController(com.parent);
        }
    }

    //获取显示在界面上真实的x坐标，加上父级坐标
    getRealXRecursion(com){
        if (com.parent)
        {
            return com.style.x + this.getRealXRecursion(com.parent);
        }
        else
        {
            return com.style.x;
        }
    }
    getRealX(){
        return this.getRealXRecursion(this);
    }
    getRealYRecursion(com){
        if (com.parent)
        {
            return com.style.y + this.getRealYRecursion(com.parent);
        }
        else{
            return com.style.y;
        }
    }
    getRealY(){
        return this.getRealYRecursion(this);
    }
    /** 获取文本的坐标 */
    getTextRealX(){
        let oriX = this.getRealX();
        //文字居中显示
        if (this.getText() && this.style.textAlign === "center")
        {
            let textLength = parseInt(this.style.fontSize) * this.getText().length;
            if (textLength <= this.getWidth())
            {
                return oriX + (this.getWidth() / 2 - textLength / 2);
            }
        }
        return oriX;
    }
    getTextRealY(){
        return this.getRealY();
    }

    /** 高宽处理 */
    setWidth(width){
        this.style.width = width;
    }
    setHeight(height){
        this.style.height = height;
    }
    getWidth(){
        return this.style.width;
    }
    getHeight(){
        return this.style.height;
    }

    /** 用\n分隔string，实现换行 */
    getTextForRows(text){
        if (!text)
        {
            return undefined;
        }
        let rowsStr;
        if (!this.multiLine)//单行
        {
            rowsStr = [text];
        }
        else
        {
            if (this.autoLine)//如果自动换行
            {
                let index = 0;
                let charWidth = 0;
                let char;
                while (char = text.charAt(index)) {
                    if (char === "\n") {
                        charWidth = 0;
                    }
                    else {
                        charWidth += parseInt(this.style.fontSize, 10);
                        if (charWidth > this.getWidth()) {//如果当前行宽度大于组件宽度，则添加一个换行符
                            charWidth = 0;
                            text = text.substring(0, index) + "\n" + text.substring(index);
                        }
                    }
                    index++;
                }
            }
            rowsStr = text.split("\n");
        }
        let i;
        let c;
        let arr;
        return rowsStr.map((row)=>{
            i = 0;
            arr = [];
            while (c = row.charAt(i))
            {
                arr.push(c);
                i++;
            }
            return arr;
        });
    }

    setText(text){
        this.text = this.getTextForRows(text);
    }

    getText(){
        if (!this.text)
        {
            return undefined;
        }
        return this.text.map((row, index)=>{
            return row.join("");
        }).join("\n");
    }

    getChildren(){
        return this.children;
    }

    registerEvent(eventType, callback){
        globalUtil.eventBus.registerEvent(this, eventType, callback);
    }

    addEventNotify(eventNotify){
        this.eventNotifys.push(eventNotify);
    }
}