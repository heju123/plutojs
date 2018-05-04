import Component from "../components/component";

export default class Dom{
    dom : HTMLElement;
    parent : Component;

    constructor(parent : Component, cfg : any){
        this.parent = parent;
    }

    init(){
        this.dom.style["position"] = "absolute";
    }

    initCfg(cfg : any){
        if (cfg.style.x !== undefined)
        {
            let x = 0;
            if (cfg.style.x && cfg.style.x.toString().indexOf("%") > -1)//百分比
            {
                x = this.parent.getInnerWidth() * (cfg.style.x.substring(0, cfg.style.x.length - 1) / 100);
            }
            else
            {
                x = cfg.style.x;
            }
            this.dom.style["x"] = x + "px";
        }
        if (cfg.style.y !== undefined)
        {
            let y = 0;
            if (cfg.style.y && cfg.style.y.toString().indexOf("%") > -1)//百分比
            {
                y = this.parent.getInnerHeight() * (cfg.style.y.substring(0, cfg.style.y.length - 1) / 100);
            }
            else
            {
                y = cfg.style.y;
            }
            this.dom.style["y"] = y + "px";
        }
        if (cfg.style.width !== undefined)
        {
            let width = 0;
            if (cfg.style.width.indexOf("%") > -1)
            {
                width = this.parent.getWidth() * (cfg.style.width.substring(0, cfg.style.width.length - 1) / 100);
            }
            else
            {
                width = cfg.style.width;
            }
            this.dom.style["width"] = width + "px";
        }
        if (cfg.style.height !== undefined)
        {
            let height = 0;
            if (cfg.style.height.indexOf("%") > -1)
            {
                height = this.parent.getHeight() * (cfg.style.height.substring(0, cfg.style.height.length - 1) / 100);
            }
            else
            {
                height = cfg.style.height;
            }
            this.dom.style["height"] = height + "px";
        }

        if (cfg.style.zIndex !== undefined)
        {
            this.dom.style["z-index"] = cfg.style.zIndex;
        }
    }
}