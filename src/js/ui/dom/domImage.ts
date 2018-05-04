import Component from "../components/component";
import Dom from "./dom";

export default class DomImage extends Dom{
    constructor(parent : Component, cfg : any){
        super(parent, cfg);
        this.dom = document.createElement("IMG");
        this.initCfg(cfg);
        this.init();
    }

    initCfg(cfg : any){
        super.initCfg(cfg);

        if (cfg.style.src)
        {
            this.dom.setAttribute("src", cfg.style.src);
        }
    }
}