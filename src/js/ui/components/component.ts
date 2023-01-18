/**
 * Created by heju on 2017/7/20.
 */
import globalUtil from "../../util/globalUtil";
import commonUtil from "../../util/commonUtil";
import animationUtil from "../../util/animationUtil";
import EventNotify from "../../event/eventNotify";
import ViewState from "../viewState";
import PhysicsQueue from "../../effect/physics/physicsQueue";
import Physics from "../../effect/physics/physics";
import Particle from "../../effect/particle/particle";
import LinkedList from "../../data/structure/linkedList";
import LinkedItem from "../../data/structure/linkedItem";

declare const require: any;

abstract class Component {
    id : string;
    name : string;
    text : any;
    animation : any;
    type : string;
    parent : Component;
    viewState : ViewState;
    isInit : boolean;
    isSort : boolean;
    eventNotifys : Array<EventNotify>;
    active : boolean;
    hasClip : boolean;
    children : Array<Component>;
    style : any;
    controller : any;
    protected originalStyle : any;
    afterInitPromise : Promise<any>;
    protected currentBackgroundImage : any;
    protected currentBackgroundImageIndex : number;
    protected backgroundImagesIntervalObj : number;
    isHover : boolean;
    isFocus : boolean;
    isActive : boolean;
    isDoingParentClip : boolean;
    private physicsQueue : PhysicsQueue = new PhysicsQueue(this);
    private particleList : LinkedList<Particle> = new LinkedList();

    constructor(parent? : Component | ViewState) {
        if (parent)
        {
            if (parent instanceof Component)
            {
                this.parent = parent;
                if (!this.viewState)
                {
                    this.viewState = this.parent.viewState;
                }
            }
            else if (parent instanceof ViewState)
            {
                this.viewState = parent;
            }
        }
        this.isInit = false;
        this.isSort = false;//子组件是否已排序
        this.eventNotifys = [];//事件通知队列
        this.active = true;//为false则不绘制
        this.hasClip = true;//是否需要剪切边界
        this.children = [];

        this.style = {};
        this.originalStyle = {};//保存原来的样式，避免focus或hover后原来的样式丢失

        this.setDefaultStyle();
        this.setStyle("lineHeight", parseInt(this.style.fontSize, 10));
    }

    init() : Promise<any>{
        let allPromise = [];
        //自适应宽度
        if (this.style.autoWidth)
        {
            let textWidth = this.getTextWidth();
            if (textWidth && textWidth > 0){
                this.setStyle("width", textWidth);
            }
        }

        if (this.style.backgroundImages && this.style.backgroundImages.length > 0)//多背景图片轮询播放
        {
            allPromise.push(this.initBackgroundImages());
            //轮询播放
            if (this.style.backgroundImagesInterval && this.style.backgroundImagesInterval > 0)
            {
                this.createBackgroundImagesIntervalObj(this.style.backgroundImagesInterval);
            }
        }
        else if (this.style.backgroundImage)
        {
            this.currentBackgroundImage = {
                url : this.style.backgroundImage
            };
            if (this.style.backgroundImageClip)
            {
                this.currentBackgroundImage.clip = this.style.backgroundImageClip;
            }
            allPromise.push(new Promise((resolve)=> {
                this.initBackgroundImageDom(this.currentBackgroundImage.url).then((imgDom) => {
                    this.currentBackgroundImage.dom = imgDom;
                    resolve();
                });
            }));
        }
        this.afterInitPromise = new Promise((resolve)=>{
            if (allPromise.length > 0)
            {
                Promise.all(allPromise).then(()=>{
                    this.isInit = true;
                    resolve();
                });
            }
            else
            {
                this.isInit = true;
                resolve();
            }
        });
        return this.afterInitPromise;
    }

    private initBackgroundImageDom(url : string) : Promise<any>{
        let $this = this;
        return new Promise((resolve, reject)=>{
            commonUtil.createImageDom(url).then((imgThis)=>{
                if (!$this.getWidth() || $this.style.autoWidth)
                {
                    $this.setWidth(imgThis.width);
                }
                if (!$this.getHeight() || $this.style.autoHeight)
                {
                    $this.setHeight(imgThis.height);
                }
                resolve(imgThis);
            });
        });
    }

    private initBackgroundImages(backgroundImages? : Array<any>) : Promise<any>{
        let bgImages = backgroundImages || this.style.backgroundImages;
        let allPromise = [];
        if (this.style.backgroundImage)//如果设置backgroundImages的情况下又有backgroundImage，则所有背景图片url都等于backgroundImage
        {
            allPromise.push(new Promise((resolve)=>{
                this.initBackgroundImageDom(this.style.backgroundImage).then((imgDom)=>{
                    bgImages.forEach((bgi)=>{
                        bgi.dom = imgDom;
                    });
                    resolve();
                });
            }));
        }
        else
        {
            bgImages.forEach((bgi)=>{
                allPromise.push(new Promise((resolve)=>{
                    this.initBackgroundImageDom(bgi.url).then((imgDom)=>{
                        bgi.dom = imgDom;
                        resolve();
                    });
                }));
            });
        }
        this.currentBackgroundImage = bgImages[0];
        this.currentBackgroundImageIndex = 0;
        return Promise.all(allPromise);
    }

    //背景图片轮询播放
    private onChangeBgImageInterval(){
        this.currentBackgroundImageIndex++;
        if (this.currentBackgroundImageIndex > this.style.backgroundImages.length - 1)
        {
            this.currentBackgroundImageIndex = 0;
        }
        this.currentBackgroundImage = this.style.backgroundImages[this.currentBackgroundImageIndex];
    }
    private createBackgroundImagesIntervalObj(interval : number){
        this.removeBackgroundImagesIntervalObj();
        this.backgroundImagesIntervalObj = window.setInterval(this.onChangeBgImageInterval.bind(this), interval);
    }
    private removeBackgroundImagesIntervalObj(){
        if (this.backgroundImagesIntervalObj)
        {
            window.clearInterval(this.backgroundImagesIntervalObj);
        }
    }

    /** 配置文件递归初始化样式 */
    private initCfgStyle(cfgStyle : any){
        for (let key in cfgStyle)
        {
            if (key === "hover" || key === "hoverout"
                || key === "active" || key === "activeout"
                || key === "focus" || key === "focusout")
            {
                this.style[key] = cfgStyle[key];
            }
            // else if (typeof(cfgStyle[key]) === "function")
            // {
            //     this.setStyle(key, cfgStyle[key].apply(this, [this]));
            // }
            else
            {
                this.setStyle(key, cfgStyle[key]);
            }
        }
    }

    /**
     * 用配置json初始化
     *
     * @param cfg
     */
    initCfg(cfg : any) : Promise<any>{
        let allPromise = [];
        if (cfg.id)
        {
            this.id = cfg.id;
        }
        if (cfg.name)
        {
            this.name = cfg.name;
        }

        this.initCfgStyle(cfg.style);

        this.text = this.getTextForRows(cfg.text);

        this.active = cfg.active === undefined || cfg.active === true ? true : false;

        this.animation = cfg.animation;

        this.type = cfg.type;

        if (cfg.hasClip !== undefined)
        {
            this.hasClip = cfg.hasClip;
        }

        allPromise.push(this.init());

        if (cfg.controller && typeof(cfg.controller) == "function")
        {
            this.controller = Object.create(cfg.controller.prototype);
            if (cfg.controllerParam && cfg.controllerParam instanceof Array)
            {
                cfg.controllerParam.unshift(this);
                cfg.controller.apply(this.controller, cfg.controllerParam);
            }
            else
            {
                cfg.controller.apply(this.controller, [this]);
            }
        }
        if (cfg.children)
        {
            allPromise.push(this.initChildrenCfg(cfg.children));
        }

        //事件绑定配置
        if (cfg.events)
        {
            let funName;
            let controller;
            for (let type in cfg.events)
            {
                funName = cfg.events[type];
                controller = this.getController(this);
                if (typeof(funName) === "function")//如果funName是function，则直接绑定
                {
                    this.registerEvent(type, funName.bind(this));
                }
                else if (typeof(funName) === "string")
                {
                    this.registerEvent(type, funName);
                }
            }
        }
        return Promise.all(allPromise);
    }

    private initChildrenCfg(childrenCfg : any) : Promise<any>{
        let allPromise = [];
        if (typeof(childrenCfg) == "object" && childrenCfg instanceof Array)
        {
            let chiCfg;
            for (let i = 0, j = childrenCfg.length; i < j; i++)
            {
                chiCfg = childrenCfg[i];
                allPromise.push(this.produceChildrenByCfg(chiCfg));
            }
        }
        else
        {
            allPromise.push(this.produceChildrenByCfg(childrenCfg));
        }
        if (allPromise.length > 0)
        {
            return Promise.all(allPromise);
        }
        else
        {
            return new Promise((resolve)=>{
                resolve();
            });
        }
    }

    private newComByType(type : string) : Component{
        let Router = require("./router").default;
        let Rect = require("./rect").default;
        let Input = require("./input").default;
        let Button = require("./button").default;
        let Checkbox = require("./checkbox").default;
        let Scrollbar = require("./scrollbar").default;
        let Map = require("./game/map").default;
        let Sprite = require("./game/sprite").default;
        let com;
        switch (type)
        {
            case "route" :
                com = new Router(this);
                break;
            case "rect" :
                com = new Rect(this);
                break;
            case "input" :
                com = new Input(this);
                break;
            case "button" :
                com = new Button(this);
                break;
            case "checkbox" :
                com = new Checkbox(this);
                break;
            case "scrollbar" :
                com = new Scrollbar(this);
                break;
            case "map" :
                com = new Map(this);
                break;
            case "sprite" :
                com = new Sprite(this);
            default : break;
        }
        return com;
    }

    protected produceChildrenByCfg(chiCfg : any) : Promise<any>{
        let childCom;
        if (typeof(chiCfg) === "function")//异步加载view
        {
            return chiCfg(this.asyncGetView.bind(this));
        }
        else
        {
            return new Promise((resolve)=>{
                if (chiCfg.type === "dom")
                {
                    globalUtil.domFactory.createDom(this, chiCfg.className, chiCfg);
                    resolve();
                    return;
                }
                childCom = this.newComByType(chiCfg.type);
                childCom.initCfg(chiCfg).then(()=>{
                    resolve(childCom);
                });
                this.appendChild(childCom);
                childCom.parent = this;
            });
        }
    }

    private asyncGetView(viewCfg : any, resolve : Function, reject : Function){
        if (viewCfg.type === "dom")
        {
            globalUtil.domFactory.createDom(this, viewCfg.className, viewCfg);
            resolve();
            return;
        }
        let childCom = this.newComByType(viewCfg.type);
        childCom.initCfg(viewCfg).then(()=>{
            if (resolve)
            {
                resolve(childCom);
            }
        });
        this.appendChild(childCom);
        childCom.parent = this;
    }

    /** 设置默认样式 */
    private setDefaultStyle(){
        if (this.style.fontFamily === undefined)
        {
            this.setStyle("fontFamily", this.viewState.defaultFontFamily);
        }
        if (this.style.fontSize === undefined)
        {
            this.setStyle("fontSize", this.viewState.defaultFontSize);
        }
        if (this.style.fontColor === undefined)
        {
            this.setStyle("fontColor", this.viewState.defaultFontColor);
        }
        if (this.style.zIndex === undefined)
        {
            this.setStyle("zIndex", 1);
        }
        if (this.style.multiLine === undefined)//是否多行文本
        {
            this.setStyle("multiLine", true);
        }
        if (this.style.autoLine === undefined)//是否自动换行
        {
            this.setStyle("autoLine", false);
        }
        if (this.style.scale === undefined)//缩放
        {
            this.style.scale = "1,1";
        }
        if (this.style.rotate === undefined)//旋转
        {
            this.style.rotate = 0;
        }
        if (this.style.disabled === undefined)
        {
            this.style.disabled = false;
        }
    }

    draw(ctx : CanvasRenderingContext2D) : boolean{
        //不在parent范围内，则不需要绘制
        if (!this.style.alwaysDraw)
        {
            let parentArea = this.inParentArea(this);
            if (parentArea === 0)
            {
                return false;
            }
        }

        //判断鼠标是否在组件范围内
        //防止鼠标指向子组件超出父组件的范围部分而hover到这个子组件上
        if (!this.style.disabled && (<any>ctx).mouseAction.mx && (<any>ctx).mouseAction.my
            && this.isPointInComponent(ctx, (<any>ctx).mouseAction.mx, (<any>ctx).mouseAction.my)
            && (!this.parent || !this.parent.hasClip || ((<any>ctx).mouseAction.hoverCom && (this.parent === (<any>ctx).mouseAction.hoverCom
                || this.parent === (<any>ctx).mouseAction.hoverCom.parent
                || this.parent.parentOf((<any>ctx).mouseAction.hoverCom)))))
        {
            (<any>ctx).mouseAction.hoverCom = this;
        }

        //检查事件
        if (this.eventNotifys.length > 0)
        {
            this.eventNotifys.forEach((eventNotify)=>{
                this.checkEvent(eventNotify);
            });
            this.eventNotifys.length = 0;
        }

        //物理影响
        if (this.physicsQueue.getLength() > 0)
        {
            this.physicsQueue.effect();
        }

        //粒子效果绘制
        if (this.particleList.head)
        {
            this.particleList.forEach((particle)=>{
                particle.value.drawParticle(ctx);
                if (!particle.value.alive && !particle.value.isDestroying)//粒子已失效，需要清除
                {
                    particle.value.isDestroying = true;
                    let promise;
                    if (particle.value.beforeDestroy)
                    {
                        promise = particle.value.beforeDestroy.apply(particle.value, []);
                    }
                    if (promise)
                    {
                        promise.then(()=>{
                            this.particleList.remove(particle);

                            if (particle.value.destroyed)
                            {
                                particle.value.destroyed.apply(this, []);
                            }
                        });
                    }
                    else
                    {
                        this.particleList.remove(particle);

                        if (particle.value.destroyed)
                        {
                            particle.value.destroyed.apply(this, []);
                        }
                    }
                }
            });
        }
        return true;
    }

    /** 添加物理现象 */
    addPhysics(physics : Physics){
        this.physicsQueue.add(physics);
    }

    /** 添加粒子 */
    addParticle(particle : Particle) {
        if (particle.beforeMount)
        {
            particle.beforeMount.apply(particle, []);
        }
        this.particleList.add(particle);
        if (particle.mounted)
        {
            particle.mounted.apply(particle, []);
        }
    }
    /** 清空所有粒子 */
    emptyParticles(){
        this.particleList.forEach((item)=>{
            if (item.value.beforeDestroy)
            {
                item.value.beforeDestroy.apply(this, []);
            }
            this.particleList.remove(item);
            if (item.value.destroyed)
            {
                item.value.destroyed.apply(this, []);
            }
        });
    }

    protected abstract inParentArea(com : Component) : number;

    protected abstract isPointInComponent(ctx : CanvasRenderingContext2D, px : number, py : number) : boolean;

    protected abstract setClip(ctx : CanvasRenderingContext2D) : void;

    /** 设置通用样式，所有组件在绘制前都应该设置 */
    protected setCommonStyle(ctx : CanvasRenderingContext2D){
        this.setDefaultStyle();//如果样式丢失，则使用默认样式
        //半透明
        let alpha = this.getAlpha();
        if (alpha !== undefined)
        {
            ctx.globalAlpha = alpha;
        }
        //将坐标原点设置到组件中心
        if (this.needTranslateOriginOfCoor2Center())
        {
            this.setOriginalCoor2Center(ctx);
        }
        //阴影
        this.setShadowEnable(ctx);
        //缩放
        this.setScaleEnable(ctx);
        //旋转
        this.setRotateEnable(ctx);
        //镜像
        this.setMirrorEnable(ctx);
        if (this.needTranslateOriginOfCoor2Center())
        {
            this.restoreOriginalCoor2Zero(ctx);
        }
    }

    /** 设置ctx的scale */
    protected setScaleEnable(ctx : CanvasRenderingContext2D){
        let scale = this.style.scale;
        if (scale !== undefined && scale !== "1,1")
        {
            let mirror = this.style.mirror;
            if (mirror !== undefined)//如果同时设置了scale和mirror，则一起交给setMirrorEnable处理
            {
                return;
            }
            let scaleArr = scale.split(",");
            ctx.scale(scaleArr[0], scaleArr[1]);
        }
    }

    /** 设置ctx的rotate */
    protected setRotateEnable(ctx : CanvasRenderingContext2D){
        let rotate = this.style.rotate;
        if (rotate !== undefined && rotate !== 0)
        {
            ctx.rotate(rotate * Math.PI/180);
        }
    }

    /** 设置镜像 */
    protected setMirrorEnable(ctx : CanvasRenderingContext2D){
        let mirror = this.style.mirror;
        if (mirror !== undefined)
        {
            let scale = this.style.scale;
            let scaleArr = [1,1];
            if (scale !== undefined && scale !== "1,1")//如果设置了scale，则一起处理
            {
                scaleArr = scale.split(",");
            }
            if (mirror === "horizontal")
            {
                ctx.scale(-scaleArr[0], scaleArr[1]);
            }
            else if (mirror === "vertical")
            {
                ctx.scale(scaleArr[0], -scaleArr[1]);
            }
        }
    }

    /** 设置ctx的阴影绘制 */
    protected setShadowEnable(ctx : CanvasRenderingContext2D){
        let shadowInfo = this.style.shadow;
        if (shadowInfo !== undefined)
        {
            ctx.shadowOffsetX = shadowInfo.x;
            ctx.shadowOffsetY = shadowInfo.y;
            ctx.shadowBlur = shadowInfo.blur;
            ctx.shadowColor = shadowInfo.color;
        }
    }

    /** 将坐标原点设置到组件中心 */
    protected setOriginalCoor2Center(ctx : CanvasRenderingContext2D){
        let transX = this.getRealXRecursion(this) + this.getWidth() / 2;
        let transY = this.getRealYRecursion(this) + this.getHeight() / 2;
        ctx.translate(transX, transY);
    }
    /** 将坐标原点从组件中心还原到0,0 */
    protected restoreOriginalCoor2Zero(ctx : CanvasRenderingContext2D){
        let transX = this.getRealXRecursion(this) + this.getWidth() / 2;
        let transY = this.getRealYRecursion(this) + this.getHeight() / 2;
        ctx.translate(-transX, -transY);
    }

    /** 将样式恢复成original */
    protected restoreStyle2Original(){
        this.copyStyle(this.originalStyle);
        //删掉多余样式
        commonUtil.removeExtraAttr(this.style, this.originalStyle, "hover,hoverout,active,activeout,focus,focusout");
    }

    /** 将样式恢复成active或hover或focus或original */
    private restoreStyle(){
        if (this.isActive && this.style.active)
        {
            this.restoreStyle2Original();
            this.copyStyle(this.style.active);
        }
        else if (this.isHover && this.style.hover)
        {
            this.restoreStyle2Original();
            this.copyStyle(this.style.hover);
        }
        else if (this.isFocus && this.style.focus)
        {
            this.restoreStyle2Original();
            this.copyStyle(this.style.focus);
        }
        else
        {
            this.restoreStyle2Original();
        }
    }

    onFocus(mx : number, my : number){
        this.isFocus = true;
        if (this.style.focus)
        {
            if (typeof(this.style.focus) === "function")
            {
                this.style.focus.apply(this, [this]);
            }
            else
            {
                this.copyStyle(this.style.focus);
            }
        }
    }
    onFocusout(){
        this.isFocus = false;
        if (this.style.focus)
        {
            if (typeof(this.style.focusout) === "function")
            {
                this.style.focusout.apply(this, [this]);
            }
            else
            {
                this.restoreStyle();
            }
        }
    }

    onHover(){
        this.isHover = true;
        if (this.style.hover)
        {
            if (typeof(this.style.hover) === "function")
            {
                this.style.hover.apply(this, [this]);
            }
            else
            {
                this.copyStyle(this.style.hover);
            }
        }
        // 子组件和父组件同时设置了cursor属性，以子组件的为准
        if (this.style.cursor && this.viewState.canvas.style.cursor === 'default')
        {
            this.viewState.canvas.style.cursor = this.style.cursor;
        }
        if (this.parent)
        {
            this.parent.onHover();
        }
    }
    onHoverout(){
        this.isHover = false;
        if (this.style.hover)
        {
            if (typeof(this.style.hoverout) === "function")
            {
                this.style.hoverout.apply(this, [this]);
            }
            else
            {
                this.restoreStyle();
            }
        }
        if (this.style.cursor)
        {
            this.viewState.canvas.style.cursor = "default";
        }
        if (this.parent)
        {
            this.parent.onHoverout();
        }
    }

    onActive(mx : number, my : number){
        this.isActive = true;
        if (this.style.active)
        {
            if (typeof(this.style.active) === "function")
            {
                this.style.active.apply(this, [this]);
            }
            else
            {
                this.copyStyle(this.style.active);
            }
        }
    }
    onActiveout(){
        this.isActive = false;
        if (this.style.active)
        {
            if (typeof(this.style.activeout) === "function")
            {
                this.style.activeout.apply(this, [this]);
            }
            else
            {
                this.restoreStyle();
            }
        }
    }

    /** 检查事件是否匹配 */
    private checkEvent(eventNotify : EventNotify){
        let Map = require("./game/map").default;

        if (eventNotify.type)
        {
            if (eventNotify.type === 1
                && (globalUtil.action.hoverComponent === this || this.parentOf(globalUtil.action.hoverComponent)))//判断鼠标是否在控件范围内,type等于1表示鼠标事件
            {
                globalUtil.eventBus.captureEvent(eventNotify);
            }
            else if (eventNotify.type === 2
                && (globalUtil.action.focusComponent === this || this instanceof Map))//键盘事件(地图无条件接收键盘事件)
            {
                globalUtil.eventBus.captureEvent(eventNotify);
            }
            else if (eventNotify.type === 3
                && (globalUtil.action.focusComponent === this
                    || this.parentOf(globalUtil.action.focusComponent)))//鼠标滚动事件
            {
                globalUtil.eventBus.captureEvent(eventNotify);
            }
        }
    }

    /** 冒泡执行doLayout方法 */
    private propagationDoLayout(com : Component){
        if (com.doLayout && typeof(com.doLayout) === "function")
        {
            com.doLayout();
        }
        if (com.parent)
        {
            this.propagationDoLayout(com.parent);
        }
    }

    /** 获取所有的权值 */
    private getAllWeight() : number{
        let allWeight = 0;
        this.children.forEach((child, index)=>{
            if (child.style.layout && child.style.layout.layoutWeight)
            {
                allWeight += child.style.layout.layoutWeight;
            }
            else
            {
                allWeight += 1;
            }
        });
        return allWeight;
    }
    protected doLayout(){
        if (this.style.layout && this.style.layout.type)
        {
            switch(this.style.layout.type)
            {
                case "linearLayout" :
                    let fixByWeight = this.style.layout.fixByWeight || false;
                    let allWeight = 0;
                    if (fixByWeight)
                    {
                        allWeight = this.getAllWeight();//总权值
                    }
                    let allWH : number = 0;//记录高宽，确定x和y坐标
                    let hY : number = 0;//horizontal模式下的y坐标
                    let maxHeight : number = 0;//记录子组件最大高度值，自动换行时有用
                    let maxChildrenHeight : number = 0;//记录子组件最大高度，horizontal自动换行时用
                    let maxChildrenWidth : number = 0;//记录子组件最大宽度，vertical时记录最大宽度
                    this.children.forEach((child, index)=>{
                        let weight = 1;
                        if (child.style.layout && child.style.layout.layoutWeight)
                        {
                            weight = child.style.layout.layoutWeight;
                        }
                        if (!this.style.layout.orientation || this.style.layout.orientation === "horizontal")
                        {
                            let width;
                            if (fixByWeight)
                            {
                                width = this.getInnerWidth() * (weight / allWeight);
                            }
                            else
                            {
                                width = child.getWidth();
                            }

                            //自动换行（autoWidth时不能自动换行，第一个组件不能执行自动换行）
                            if ((this.style.layout.autoLine === undefined || this.style.layout.autoLine === true)
                                && !this.style.autoWidth && index > 0)
                            {
                                if (allWH + width > this.getInnerWidth())
                                {
                                    allWH = 0;
                                    hY += maxHeight;
                                    maxChildrenHeight += maxHeight;
                                    maxHeight = 0;
                                }
                            }

                            child.setX(allWH);
                            child.setY(hY);
                            child.setWidth(width);
                            maxHeight = Math.max(maxHeight, child.getHeight());
                            allWH += width;
                        }
                        else if (this.style.layout.orientation === "vertical")
                        {
                            let height;
                            if (fixByWeight)
                            {
                                height = this.getInnerHeight() * (weight / allWeight);
                            }
                            else
                            {
                                height = child.getHeight();
                            }
                            child.setY(allWH);
                            child.setX(child.getX() || 0);
                            child.setHeight(height);
                            allWH += height;
                            maxChildrenWidth = Math.max(maxChildrenWidth, child.getWidth());
                        }
                    });
                    maxChildrenHeight += maxHeight;

                    //自适应高宽
                    if (!this.style.layout.orientation || this.style.layout.orientation === "horizontal")
                    {
                        if (this.style.autoWidth)//自适应宽度内容居中无意义
                        {
                            this.setWidth(allWH);
                        }
                        if (this.style.autoHeight)
                        {
                            this.setHeight(maxChildrenHeight);
                        }
                        if (!this.style.autoHeight && this.style.layout.contentAlign === "center")//内容居中
                        {
                            this.children.forEach((child, index)=>{
                                child.setY(this.getInnerHeight() / 2 - child.getHeight() / 2);
                            });
                        }
                    }
                    else if (this.style.layout.orientation === "vertical")
                    {
                        if (this.style.autoHeight)
                        {
                            this.setHeight(allWH);
                        }
                        if (this.style.autoWidth)
                        {
                            this.setWidth(maxChildrenWidth);
                        }
                        if (!this.style.autoWidth && this.style.layout.contentAlign === "center")//内容居中
                        {
                            this.children.forEach((child, index)=>{
                                child.setX(this.getInnerWidth() / 2 - child.getWidth() / 2);
                            });
                        }
                    }
                    break;
                default : break;
            }
        }
    }

    /** this是否是com的父亲 */
    parentOf(com : Component) : boolean{
        if (!com || !com.parent)
        {
            return false;
        }
        if (com.parent === this)
        {
            return true;
        }
        return this.parentOf(com.parent);
    }

    /** 执行样式改变动画 */
    doStyleAnimation(styleKey : string, toVal : string) : Promise<any>{
        if (!this.animation || !this.animation[styleKey])
        {
            return;
        }
        return animationUtil.executeStyleChange(this, styleKey, toVal, this.animation[styleKey]);
    }

    /** 防止改变originalStyle，所以这里要专门写一个方法，而不使用setStyle方法 */
    private copyStyle(source : any){
        for (let key in source)
        {
            if (key === "backgroundImage")//更换图片
            {
                if (this.style.backgroundImages && this.style.backgroundImages.length > 0)
                {
                    this.style.backgroundImages.forEach((bgi)=>{
                        bgi.dom.src = source[key];
                    });
                }
                else if (this.currentBackgroundImage && this.currentBackgroundImage.dom)
                {
                    this.currentBackgroundImage.dom.src = source[key];
                }
            }

            if (key === "backgroundImages" && source[key] && source[key].length > 0)
            {
                this.initBackgroundImages(source[key]);
            }
            if (key === "backgroundImagesInterval")
            {
                this.createBackgroundImagesIntervalObj(source[key]);
            }

            if (this.animation && this.animation[key])
            {
                this.doStyleAnimation(key, source[key]);
            }
            else
            {
                this.style[key] = source[key];
            }
        }
    }

    /** 设置组件样式 */
    setStyle(arg1 : any, arg2? : any, arg3? : any) : Promise<any>{
        let allAniPromise;
        if (typeof(arg1) === "object")
        {
            allAniPromise = this.setStyle_obj(arg1, arg2);
        }
        else if (typeof(arg1) === "string")
        {
            allAniPromise = this.setStyle_kv(arg1, arg2, arg3);
        }
        if (allAniPromise)
        {
            if (!(allAniPromise instanceof Array))
            {
                allAniPromise = [allAniPromise];
            }
            return Promise.all(allAniPromise);
        }
        else
        {
            return undefined;
        }
    }
    private setStyle_kv(key : any, value : any, doAni? : any) : Promise<any>{
        if (this.originalStyle[key] === value)//如果设置的值相同，则不需要耗费性能
        {
            return;
        }

        doAni = doAni === undefined || doAni === true ? true : false;
        //以下值不允许出现小数
        // if (key === "x" || key === "y" || key === "width" || key === "height")
        // {
        //     if (value && typeof(value) !== "function" && value.toString().indexOf("%") === -1)//非百分比
        //     {
        //         value = Math.round(value);
        //     }
        // }

        if (key === "backgroundImage")//更换图片
        {
            if (this.style.backgroundImages && this.style.backgroundImages.length > 0)
            {
                this.style.backgroundImages.forEach((bgi)=>{
                    bgi.dom.src = value;
                });
            }
            else if (this.currentBackgroundImage && this.currentBackgroundImage.dom)
            {
                this.currentBackgroundImage.dom.src = value;
            }
        }

        if (key === "backgroundImages" && value && value.length > 0)
        {
            this.initBackgroundImages(value);
        }
        if (key === "backgroundImagesInterval")
        {
            this.createBackgroundImagesIntervalObj(value);
        }

        if (key === "zIndex")
        {
            this.isSort = false;
        }

        let aniPromise;
        if (doAni && this.animation && this.animation[key])
        {
            aniPromise = this.doStyleAnimation(key, value);
        }
        else
        {
            this.style[key] = value;
        }
        this.originalStyle[key] = value;
        return aniPromise;
    }
    private setStyle_obj(style : any, doAni : any) : Array<Promise<any>>{
        let aniPromiseArr = [];
        let aniPromise;
        for (let key in style)
        {
            aniPromise = this.setStyle_kv(key, style[key], doAni);
            if (aniPromise)
            {
                aniPromiseArr.push(aniPromise);
            }
        }
        return aniPromiseArr;
    }

    /** 移除样式 */
    removeStyle(key : string){
        delete this.style[key];
        delete this.originalStyle[key];
    }

    getController(com : Component) : any{
        if (!com.parent)
        {
            return com.controller;
        }
        if (com.controller)
        {
            return com.controller;
        }
        else
        {
            return this.getController(com.parent);
        }
    }

    setX(x : number | string | Function){
        this.setStyle("x", x);
    }
    setY(y : number | string | Function){
        this.setStyle("y", y);
    }
    getX() : number{
        if (this.style.x && typeof(this.style.x) === "function")
        {
            return this.style.x.apply(this, [this]);
        }
        if (this.style.x && this.style.x.toString().indexOf("%") > -1)//百分比
        {
            let maxX = this.parent.getInnerWidth();
            return maxX * (this.style.x.substring(0, this.style.x.length - 1) / 100);
        }
        return this.style.x - (this.style.scrollX || 0);//要减去滚动的长度
    }
    getY() : number{
        if (this.style.y && typeof(this.style.y) === "function")
        {
            return this.style.y.apply(this, [this]);
        }
        if (this.style.y && this.style.y.toString().indexOf("%") > -1)//百分比
        {
            let maxY = this.parent.getInnerHeight();
            return maxY * (this.style.y.substring(0, this.style.y.length - 1) / 100);
        }
        return this.style.y - (this.style.scrollY || 0);
    }

    //设置真实坐标，传入真实坐标,会转换成x或y
    setRealX(rx : number){
        if (this.parent)
        {
            this.setX(rx - this.getRealXRecursion(this.parent));
        }
        else
        {
            this.setX(rx);
        }
    }
    setRealY(ry : number){
        if (this.parent)
        {
            this.setY(ry - this.getRealYRecursion(this.parent));
        }
        else
        {
            this.setY(ry);
        }
    }

    //获取显示在界面上真实的x坐标，加上父级坐标
    getRealXRecursion(com : Component) : number{
        if (com.parent)
        {
            return com.getX() + this.getRealXRecursion(com.parent) + (com.parent.style.borderWidth || 0);
        }
        else
        {
            return com.getX();
        }
    }
    getRealX() : number{
        return this.getRealXRecursion(this);
    }
    getRealYRecursion(com : Component) : number{
        if (com.parent)
        {
            return com.getY() + this.getRealYRecursion(com.parent) + (com.parent.style.borderWidth || 0);
        }
        else{
            return com.getY();
        }
    }
    getRealY() : number{
        return this.getRealYRecursion(this);
    }

    /** 获取文本的坐标 */
    protected getTextRealX() : number{
        let oriX = this.getRealX() + (this.style.borderWidth || 0);
        //文字居中显示
        if (this.text && this.style.textAlign === "center")
        {
            let Input = require("./input").default;
            let textLength;
            if (this instanceof Input)
            {
                textLength = parseInt(this.style.fontSize) * this.getText().length;
            }
            else
            {
                textLength = this.viewState.ctx.measureText(this.getText()).width;
            }
            if (textLength <= this.getWidth())
            {
                return oriX + (this.getWidth() / 2 - textLength / 2);
            }
        }
        return oriX - (this.style.textScrollX || 0);
    }
    protected getTextRealY() : number{
        return this.getRealY() + (this.style.borderWidth || 0) - (this.style.textScrollY || 0);
    }

    /** 高宽处理 */
    setWidth(width : number | string | Function){
        this.setStyle("width", width);
    }
    setHeight(height : number | string | Function){
        this.setStyle("height", height);
    }
    getWidth() : number{
        if (!this.style.width)
        {
            return undefined;
        }
        if (typeof(this.style.width) === "function")
        {
            return this.style.width.apply(this, [this]);
        }
        if (this.style.width.toString().indexOf("%") > -1)//百分比
        {
            let maxWidth = this.parent ? this.parent.getInnerWidth() : this.viewState.getWidth();
            return maxWidth * (this.style.width.substring(0, this.style.width.length - 1) / 100);
        }
        return this.style.width;
    }
    getHeight() : number{
        if (!this.style.height)
        {
            return undefined;
        }
        if (typeof(this.style.height) === "function")
        {
            return this.style.height.apply(this, [this]);
        }
        if (this.style.height.toString().indexOf("%") > -1)
        {
            let maxHeight = this.parent ? this.parent.getInnerHeight() : this.viewState.getHeight();
            return maxHeight * (this.style.height.substring(0, this.style.height.length - 1) / 100);
        }
        return this.style.height;
    }
    //获取去边框的宽高
    getInnerWidth() : number{
        return this.getWidth() - (this.style.borderWidth || 0) * 2;
    }
    getInnerHeight() : number{
        return this.getHeight() - (this.style.borderWidth || 0) * 2;
    }

    //获取所有子节点宽度总和
    getChildrenWidth(): number{
        if (this.children && this.children.length > 0){
            let allWidth = 0;
            this.children.forEach((child)=>{
                allWidth += child.getWidth();
            })
            return allWidth;
        }
        return 0;
    }
    //获取所有子节点高度总和
    getChildrenHeight(): number{
        if (this.children && this.children.length > 0){
            let allHeight = 0;
            this.children.forEach((child)=>{
                allHeight += child.getHeight();
            })
            return allHeight;
        }
        return 0;
    }

    /** 获取alpha值，如果当前组件无alpha，则取父节点的 */
    getAlpha() : number{
        if (this.style.alpha !== undefined)
        {
            return this.style.alpha;
        }
        else if (this.style.alpha === undefined && this.parent)
        {
            return this.parent.getAlpha();
        }
        else
        {
            return undefined;
        }
    }

    /**
     * 是否需要移动坐标原点到组件中心（比如scale和rotate等情况）
     *
     * @return true 是0,0
     */
    protected needTranslateOriginOfCoor2Center() : boolean{
        let scale = this.style.scale;
        let rotate = this.style.rotate;
        let mirror = this.style.mirror;
        if ((scale !== undefined && scale !== "1,1")
            || (rotate !== undefined && rotate !== 0)
            || mirror !== undefined)
        {
            return true;
        }
        return false;
    }

    /** 用\n分隔string，实现换行 */
    protected getTextForRows(text : string) : any{
        if (!text)
        {
            return undefined;
        }
        let rowsStr;
        if (!this.style.multiLine)//单行
        {
            rowsStr = [text];
        }
        else
        {
            let Input = require("./input").default;
            if (this.style.autoLine)//如果自动换行
            {
                let index = 0;
                let charWidth = 0;
                let char;
                while (char = text.charAt(index)) {
                    if (char === "\n") {
                        charWidth = 0;
                    }
                    else {
                        if (this instanceof Input)
                        {
                            charWidth += parseInt(this.style.fontSize, 10);
                        }
                        else
                        {
                            charWidth += this.getCharWidth(char);
                        }
                        if (charWidth > this.getWidth() - (this.style.borderWidth || 0) * 2) {//如果当前行宽度大于组件宽度，则添加一个换行符
                            charWidth = 0;
                            text = text.substring(0, index) + "\n" + text.substring(index);
                        }
                    }
                    index++;
                }
            }
            rowsStr = text.split("\n");
        }
        return rowsStr;
    }

    /** 获取字符宽度，中文占1个fontSize */
    protected getCharWidth(char : string) : number{
        if(char.charCodeAt(0) > 128)
        {
            return parseInt(this.style.fontSize, 10);
        }
        else
        {
            return parseInt(this.style.fontSize, 10) / 2;
        }
    }

    setText(text : string){
        this.text = this.getTextForRows(text.toString());
        //自适应宽度
        if (this.style.autoWidth)
        {
            this.setStyle("width", this.getTextWidth());
        }
    }

    getText() : string{
        if (!this.text)
        {
            return undefined;
        }
        return this.text.join("\n");
    }

    /** 获取文本占的总高度 */
    getTextHeight() : number{
        if (!this.text)
        {
            return 0;
        }
        return this.text.length * parseInt(this.style.lineHeight, 10);
    }
    getTextWidth() : number{
        if (!this.text)
        {
            return 0;
        }
        let Input = require("./input").default;
        let allWidth = 0;
        this.text.forEach((row, index)=> {
            if (this instanceof Input)
            {
                allWidth = Math.max(allWidth, row.length * parseInt(this.style.fontSize, 10));
            }
            else
            {
                globalUtil.action.measureTextDom.style.fontSize = this.style.fontSize;
                globalUtil.action.measureTextDom.style.fontFamily = this.style.fontFamily;
                globalUtil.action.measureTextDom.innerText = row;
                allWidth = Math.max(allWidth, globalUtil.action.measureTextDom.offsetWidth);
            }
        });
        return allWidth;
    }

    /** 测量文字宽度，使用当前组件的fontSize和fontFamily */
    measureTextWidth(text: string): number{
        globalUtil.action.measureTextDom.style.fontSize = this.style.fontSize;
        globalUtil.action.measureTextDom.style.fontFamily = this.style.fontFamily;
        globalUtil.action.measureTextDom.innerText = text;
        return globalUtil.action.measureTextDom.offsetWidth;
    }

    getChildren() : Array<Component> | Component{
        return this.children;
    }

    /** 添加子节点 */
    appendChild(child : Component){
        this.children.push(child);
        this.isSort = false;

        child.afterInitPromise.then(()=>{
            this.propagationDoLayout(this);
        });
    }

    /** 删除子组件 */
    removeChild(arg0 : number | Component){
        if (typeof(arguments[0]) === "number")
        {
            this._removeChildByIndex(arguments[0]);
        }
        else if (typeof(arguments[0]) === "object" && arguments[0] instanceof Component)
        {
            this._removeChildByCom(arguments[0]);
        }
    }
    _removeChildByCom(obj : Component){
        let item;
        for (let i = 0; i < this.children.length; i++)
        {
            item = this.children[i];
            if (item === obj)
            {
                this._removeChildByIndex(i);
                break;
            }
        }
    }
    /** 删除指定位置的子组件 */
    _removeChildByIndex(index : number){
        if (this.children[index])
        {
            this.children[index].destroy();
            this.children.splice(index, 1);
            this.propagationDoLayout(this);
        }
    }

    removeAllChildren(name? : string){
        if (!name)
        {
            this.children.forEach((child)=>{
                child.destroy();
            });
            this.children.length = 0;
            this.propagationDoLayout(this);
        }
        else
        {
            this.children = this.children.filter((child)=>{
                if (child.name === name)
                {
                    child.destroy();
                    this.propagationDoLayout(this);
                    return false;
                }
                return true;
            });
        }
    }

    registerEvent(eventType : string, callback : Function | string){
        globalUtil.eventBus.registerEvent(this, eventType, callback);
    }

    removeEvent(eventType : string, callback : Function | string){
        globalUtil.eventBus.removeEvent(this, eventType, callback);
    }

    removeAllEvent()
    {
        globalUtil.eventBus.removeAllEvent(this);
    }

    addEventNotify(eventNotify : EventNotify){
        this.eventNotifys.push(eventNotify);
    }

    //是否支持拖动
    getDragComponent(com : Component) : Component{
        if (com.style.draggable)
        {
            return com;
        }
        else if (!com.parent)
        {
            return undefined;
        }
        else
        {
            return com.getDragComponent(com.parent);
        }
    }

    getComponentById(id : string) : Component{
        if (this.id && this.id === id)
        {
            return this;
        }
        else
        {
            return this.viewState.getComponentInChildrenByKey("id", id, this);
        }
    }

    getComponentByName(name : string) : Component{
        if (this.name && this.name === name)
        {
            return this;
        }
        else
        {
            return this.viewState.getComponentInChildrenByKey("name", name, this);
        }
    }

    /** 用name获取组件集合 */
    getComponentsByName(name : string) : Array<Component>{
        if (this.name && this.name === name)
        {
            return [this];
        }
        else
        {
            return this.viewState.getComponentsInChildrenByKey("name", name, this);
        }
    }

    /** 用type获取组件集合 */
    getComponentsByType(type : string) : Array<Component>{
        if (this.type && this.type === type)
        {
            return [this];
        }
        else
        {
            return this.viewState.getComponentsInChildrenByKey("type", type, this);
        }
    }

    /** 触发事件 */
    triggerEvent(type : string){
        globalUtil.eventBus.triggerEvent(type, this);
    }

    /** 将指定区域转换为图片地址 */
    transform2Base64(){
        return commonUtil.transform2Base64(this.viewState.canvas, this.getRealX(), this.getRealY(), this.getWidth(), this.getHeight())
    }

    destroy(){
        this.removeAllEvent();

        this.removeBackgroundImagesIntervalObj();

        if (this.physicsQueue.getLength() > 0)
        {
            this.physicsQueue.destroy();
        }

        if (this.controller && this.controller.destroy
            && typeof(this.controller.destroy) === "function")
        {
            this.controller.destroy();
        }

        (<Array<Component>>this.children).forEach((child)=>{
            child.destroy();
        });
    }
}

export default Component;