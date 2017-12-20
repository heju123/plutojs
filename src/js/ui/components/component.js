/**
 * Created by heju on 2017/7/20.
 */
import globalUtil from "../../util/globalUtil.js";
import commonUtil from "../../util/commonUtil.js";
import animationUtil from "../../util/animationUtil.js";

export default class Component {
    constructor(parent) {
        this.parent = parent;
        this.isInit = false;
        this.eventNotifys = [];//事件通知队列
        this.active = true;//为false则不绘制
        this.children = [];

        this.style = {};
        this.originalStyle = {};//保存原来的样式，避免focus或hover后原来的样式丢失

        this.setDefaultStyle();
        this.setStyle("lineHeight", parseInt(this.style.fontSize, 10));
    }

    init(){
        let allPromise = [];
        //自适应宽度
        if (this.style.autoWidth)
        {
            this.setStyle("width", this.getTextWidth());
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

    initBackgroundImageDom(url){
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

    initBackgroundImages(backgroundImages){
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
    onChangeBgImageInterval(){
        this.currentBackgroundImageIndex++;
        if (this.currentBackgroundImageIndex > this.style.backgroundImages.length - 1)
        {
            this.currentBackgroundImageIndex = 0;
        }
        this.currentBackgroundImage = this.style.backgroundImages[this.currentBackgroundImageIndex];
    }
    createBackgroundImagesIntervalObj(interval){
        this.removeBackgroundImagesIntervalObj();
        this.backgroundImagesIntervalObj = window.setInterval(this.onChangeBgImageInterval.bind(this), interval);
    }
    removeBackgroundImagesIntervalObj(){
        if (this.backgroundImagesIntervalObj)
        {
            window.clearInterval(this.backgroundImagesIntervalObj);
        }
    }

    /** 配置文件递归初始化样式 */
    initCfgStyle(cfgStyle){
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
            //     this.setStyle(key, cfgStyle[key].apply(this, []));
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
    initCfg(cfg){
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

        allPromise.push(this.init());

        if (cfg.controller && typeof(cfg.controller) == "function")
        {
            this.controller = new cfg.controller(this, cfg.controllerParam);
        }
        if (cfg.children)
        {
            allPromise.push(this.initChildrenCfg(cfg.children));
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
                if (typeof(funName) === "function")//如果funName是function，则直接绑定
                {
                    this.registerEvent(type, funName.bind(this));//funName是写在配置文件里的function，所以要绑定this为component
                }
                else if (controller && controller[funName]
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
        return Promise.all(allPromise);
    }

    initChildrenCfg(childrenCfg){
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

    newComByType(type){
        let Router = require("./router.js").default;
        let Rect = require("./rect.js").default;
        let Input = require("./input.js").default;
        let Button = require("./button.js").default;
        let Checkbox = require("./checkbox.js").default;
        let Scrollbar = require("./scrollbar.js").default;
        let Map = require("./game/map.js").default;
        let Sprite = require("./game/sprite.js").default;
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

    produceChildrenByCfg(chiCfg){
        let childCom;
        if (typeof(chiCfg) === "function")//异步加载view
        {
            return chiCfg(this.asyncGetView.bind(this));
        }
        else
        {
            return new Promise((resolve)=>{
                childCom = this.newComByType(chiCfg.type);
                childCom.initCfg(chiCfg).then(()=>{
                    resolve(childCom);
                });
                this.appendChildren(childCom);
                childCom.parent = this;
            });
        }
    }

    asyncGetView(viewCfg, resolve, reject){
        let childCom = this.newComByType(viewCfg.type);
        childCom.initCfg(viewCfg).then(()=>{
            if (resolve)
            {
                resolve(childCom);
            }
        });
        this.appendChildren(childCom);
        childCom.parent = this;
    }

    /** 设置默认样式 */
    setDefaultStyle(){
        if (this.style.fontFamily === undefined)
        {
            this.setStyle("fontFamily", globalUtil.viewState.defaultFontFamily);
        }
        if (this.style.fontSize === undefined)
        {
            this.setStyle("fontSize", globalUtil.viewState.defaultFontSize);
        }
        if (this.style.fontColor === undefined)
        {
            this.setStyle("fontColor", globalUtil.viewState.defaultFontColor);
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
            this.setStyle("autoLine", true);
        }
        if (this.style.scale === undefined)//缩放
        {
            this.style.scale = "1,1";
        }
        if (this.style.rotate === undefined)//旋转
        {
            this.style.rotate = 0;
        }
    }

    draw(ctx){
        //不在parent范围内，则不需要绘制
        let parentArea = this.inParentArea(this);
        if (parentArea === 0)
        {
            return false;
        }

        //判断鼠标是否在组件范围内
        //防止鼠标指向子组件超出父组件的范围部分而hover到这个子组件上
        if (ctx.mouseAction.mx && ctx.mouseAction.my
            && this.isPointInComponent(ctx, ctx.mouseAction.mx, ctx.mouseAction.my)
            && (!this.parent || (ctx.mouseAction.hoverCom && (this.parent === ctx.mouseAction.hoverCom
                || this.parent === ctx.mouseAction.hoverCom.parent
                || this.parent.parentOf(ctx.mouseAction.hoverCom)))))
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

    /** 添加子节点 */
    appendChildren(child){
        this.children.push(child);

        child.afterInitPromise.then(()=>{
            this.propagationDoLayout(this);
        });
    }

    /** 设置通用样式，所有组件在绘制前都应该设置 */
    setCommonStyle(ctx){
        this.setDefaultStyle();//如果样式丢失，则使用默认样式
        //半透明
        let alpha = this.getAlpha();
        if (alpha)
        {
            ctx.globalAlpha = alpha;
        }
        //将坐标原点设置到组件中心
        if (this.needTranslateOriginOfCoor2Center())
        {
            this.setOriginalCoor2Center(ctx);
        }
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
    setScaleEnable(ctx){
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
    setRotateEnable(ctx){
        let rotate = this.style.rotate;
        if (rotate !== undefined && rotate !== 0)
        {
            ctx.rotate(rotate * Math.PI/180);
        }
    }

    /** 设置镜像 */
    setMirrorEnable(ctx){
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

    /** 将坐标原点设置到组件中心 */
    setOriginalCoor2Center(ctx){
        let transX = this.getRealXRecursion(this) + this.getWidth() / 2;
        let transY = this.getRealYRecursion(this) + this.getHeight() / 2;
        ctx.translate(transX, transY);
    }
    /** 将坐标原点从组件中心还原到0,0 */
    restoreOriginalCoor2Zero(ctx){
        let transX = this.getRealXRecursion(this) + this.getWidth() / 2;
        let transY = this.getRealYRecursion(this) + this.getHeight() / 2;
        ctx.translate(-transX, -transY);
    }

    /** 将样式恢复成original */
    restoreStyle2Original(){
        this.copyStyle(this.originalStyle);
        //删掉多余样式
        commonUtil.removeExtraAttr(this.style, this.originalStyle, "hover,hoverout,active,activeout,focus,focusout");
    }

    /** 将样式恢复成active或hover或focus或original */
    restoreStyle(){
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

    onFocus(mx, my){
        this.isFocus = true;
        if (this.style.focus)
        {
            if (typeof(this.style.focus) === "function")
            {
                this.style.focus.apply(this, []);
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
                this.style.focusout.apply(this, []);
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
                this.style.hover.apply(this, []);
            }
            else
            {
                this.copyStyle(this.style.hover);
            }
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
                this.style.hoverout.apply(this, []);
            }
            else
            {
                this.restoreStyle();
            }
        }
        if (this.parent)
        {
            this.parent.onHoverout();
        }
    }

    onActive(mx, my){
        this.isActive = true;
        if (this.style.active)
        {
            if (typeof(this.style.active) === "function")
            {
                this.style.active.apply(this, []);
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
                this.style.activeout.apply(this, []);
            }
            else
            {
                this.restoreStyle();
            }
        }
    }

    /** 检查事件是否匹配 */
    checkEvent(eventNotify){
        let Map = require("./game/map.js").default;

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
    propagationDoLayout(com){
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
    getAllWeight(){
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
    doLayout(){
        if (this.style.layout && this.style.layout.type && this.children.length > 0)
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
                    let allWH = 0;//记录高宽，确定x和y坐标
                    let hY = 0;//horizontal模式下的y坐标
                    let maxHeight = 0;//记录子组件最大高度值，自动换行时有用
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
                            child.setX(0);
                            child.setHeight(height);
                            allWH += height;
                        }
                    });

                    //自适应高宽
                    let centerOffset = 0;//内容居中时子组件偏移量
                    if (!this.style.layout.orientation || this.style.layout.orientation === "horizontal")
                    {
                        if (this.style.autoWidth)//自适应宽度内容居中无意义
                        {
                            this.setWidth(allWH);
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
    parentOf(com){
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
    doStyleAnimation(styleKey, toVal){
        if (!this.animation || !this.animation[styleKey])
        {
            return;
        }
        return animationUtil.executeStyleChange(this, styleKey, toVal, this.animation[styleKey]);
    }

    /** 防止改变originalStyle，所以这里要专门写一个方法，而不使用setStyle方法 */
    copyStyle(source){
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
    setStyle(){
        if (arguments.length === 0)
        {
            return;
        }
        let allAniPromise;
        if (typeof(arguments[0]) === "object")
        {
            allAniPromise = this.setStyle_obj(arguments[0], arguments[1]);
        }
        else if (typeof(arguments[0]) === "string")
        {
            allAniPromise = this.setStyle_kv(arguments[0], arguments[1], arguments[2]);
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
    setStyle_kv(key, value, doAni){
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
    setStyle_obj(style, doAni){
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
    removeStyle(key){
        delete this.style[key];
        delete this.originalStyle[key];
    }

    getController(com){
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

    setX(x){
        this.setStyle("x", x);
    }
    setY(y){
        this.setStyle("y", y);
    }
    getX(){
        if (this.style.x && typeof(this.style.x) === "function")
        {
            return this.style.x.apply(this, []);
        }
        if (this.style.x && this.style.x.toString().indexOf("%") > -1)//百分比
        {
            let maxX = this.parent.getInnerWidth();
            return maxX * (this.style.x.substring(0, this.style.x.length - 1) / 100);
        }
        return this.style.x - (this.style.scrollX || 0);//要减去滚动的长度
    }
    getY(){
        if (this.style.y && typeof(this.style.y) === "function")
        {
            return this.style.y.apply(this, []);
        }
        if (this.style.y && this.style.y.toString().indexOf("%") > -1)//百分比
        {
            let maxY = this.parent.getInnerHeight();
            return maxY * (this.style.y.substring(0, this.style.y.length - 1) / 100);
        }
        return this.style.y - (this.style.scrollY || 0);
    }

    //设置真实坐标，传入真实坐标,会转换成x或y
    setRealX(rx){
        if (this.parent)
        {
            this.setX(rx - this.getRealXRecursion(this.parent));
        }
        else
        {
            this.setX(rx);
        }
    }
    setRealY(ry){
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
    getRealXRecursion(com){
        if (com.parent)
        {
            return com.getX() + this.getRealXRecursion(com.parent) + (com.parent.style.borderWidth || 0);
        }
        else
        {
            return com.getX();
        }
    }
    getRealX(){
        return this.getRealXRecursion(this);
    }
    getRealYRecursion(com){
        if (com.parent)
        {
            return com.getY() + this.getRealYRecursion(com.parent) + (com.parent.style.borderWidth || 0);
        }
        else{
            return com.getY();
        }
    }
    getRealY(){
        return this.getRealYRecursion(this);
    }

    /** 获取文本的坐标 */
    getTextRealX(){
        let oriX = this.getRealX() + (this.style.borderWidth || 0);
        //文字居中显示
        if (this.text && this.style.textAlign === "center")
        {
            let Input = require("./input.js").default;
            let textLength;
            if (this instanceof Input)
            {
                textLength = parseInt(this.style.fontSize) * this.getText().length;
            }
            else
            {
                textLength = globalUtil.viewState.ctx.measureText(this.getText()).width;
            }
            if (textLength <= this.getWidth())
            {
                return oriX + (this.getWidth() / 2 - textLength / 2);
            }
        }
        return oriX - (this.style.textScrollX || 0);
    }
    getTextRealY(){
        return this.getRealY() + (this.style.borderWidth || 0) - (this.style.textScrollY || 0);
    }

    /** 高宽处理 */
    setWidth(width){
        this.setStyle("width", width);
    }
    setHeight(height){
        this.setStyle("height", height);
    }
    getWidth(){
        if (!this.style.width)
        {
            return undefined;
        }
        if (typeof(this.style.width) === "function")
        {
            return this.style.width.apply(this, []);
        }
        if (this.style.width.toString().indexOf("%") > -1)//百分比
        {
            let maxWidth = this.parent ? this.parent.getInnerWidth() : globalUtil.viewState.getWidth();
            return maxWidth * (this.style.width.substring(0, this.style.width.length - 1) / 100);
        }
        return this.style.width;
    }
    getHeight(){
        if (!this.style.height)
        {
            return undefined;
        }
        if (typeof(this.style.height) === "function")
        {
            return this.style.height.apply(this, []);
        }
        if (this.style.height.toString().indexOf("%") > -1)
        {
            let maxHeight = this.parent ? this.parent.getInnerHeight() : globalUtil.viewState.getHeight();
            return maxHeight * (this.style.height.substring(0, this.style.height.length - 1) / 100);
        }
        return this.style.height;
    }
    //获取去边框的宽高
    getInnerWidth(){
        return this.getWidth() - (this.style.borderWidth || 0) * 2;
    }
    getInnerHeight(){
        return this.getHeight() - (this.style.borderWidth || 0) * 2;
    }

    /** 获取alpha值，如果当前组件无alpha，则取父节点的 */
    getAlpha(){
        if (this.style.alpha)
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
    needTranslateOriginOfCoor2Center(){
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
    getTextForRows(text){
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
            let Input = require("./input.js").default;
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
    getCharWidth(char){
        if(char.charCodeAt(0) > 128)
        {
            return parseInt(this.style.fontSize, 10);
        }
        else
        {
            return parseInt(this.style.fontSize, 10) / 2;
        }
    }

    setText(text){
        this.text = this.getTextForRows(text);
        //自适应宽度
        if (this.style.autoWidth)
        {
            this.setStyle("width", this.getTextWidth());
        }
    }

    getText(){
        if (!this.text)
        {
            return undefined;
        }
        return this.text.join("\n");
    }

    /** 获取文本占的总高度 */
    getTextHeight(){
        if (!this.text)
        {
            return 0;
        }
        return this.text.length * parseInt(this.style.fontSize, 10);
    }
    getTextWidth(){
        if (!this.text)
        {
            return 0;
        }
        let Input = require("./input.js").default;
        let allWidth = 0;
        this.text.forEach((row, index)=> {
            if (this instanceof Input)
            {
                allWidth = Math.max(allWidth, row.length * parseInt(this.style.fontSize, 10));
            }
            else
            {
                allWidth = Math.max(allWidth, globalUtil.viewState.ctx.measureText(row).width);
            }
        });
        return allWidth;
    }

    getChildren(){
        return this.children;
    }

    removeAllChildren(name){
        if (!name)
        {
            this.children.forEach((child)=>{
                child.destroy();
            });
            this.children.length = 0;
        }
        else
        {
            this.children = this.children.filter((child)=>{
                if (child.name === name)
                {
                    child.destroy();
                    return false;
                }
                return true;
            });
        }
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

    addEventNotify(eventNotify){
        this.eventNotifys.push(eventNotify);
    }

    //是否支持拖动
    getDragComponent(com){
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

    getComponentById(id){
        if (this.id && this.id === id)
        {
            return this;
        }
        else
        {
            return globalUtil.viewState.getComponentInChildrenByKey("id", id, this);
        }
    }

    getComponentByName(name){
        if (this.name && this.name === name)
        {
            return this;
        }
        else
        {
            return globalUtil.viewState.getComponentInChildrenByKey("name", name, this);
        }
    }

    /** 用name获取组件集合 */
    getComponentsByName(name){
        if (this.name && this.name === name)
        {
            return [this];
        }
        else
        {
            return globalUtil.viewState.getComponentsInChildrenByKey("name", name, this);
        }
    }

    /** 用type获取组件集合 */
    getComponentsByType(type){
        if (this.type && this.type === type)
        {
            return [this];
        }
        else
        {
            return globalUtil.viewState.getComponentsInChildrenByKey("type", type, this);
        }
    }

    /** 触发事件 */
    triggerEvent(type){
        globalUtil.eventBus.triggerEvent(type, this);
    }

    destroy(){
        this.removeAllEvent();

        this.removeBackgroundImagesIntervalObj();

        if (this.controller && this.controller.destroy
            && typeof(this.controller.destroy) === "function")
        {
            this.controller.destroy();
        }

        this.getChildren().forEach((child)=>{
            child.destroy();
        });
    }
}