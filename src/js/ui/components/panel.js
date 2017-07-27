/**
 * Created by heju on 2017/7/20.
 */
import Rect from "./rect.js";

export default class Panel extends Rect{
    constructor(parent){
        super(parent);
    }

    initCfg(cfg)
    {
        if (cfg.controller && typeof(cfg.controller) == "function")
        {
            this.controller = new cfg.controller(this);
        }

        if (cfg.children)
        {
            this.initChildrenCfg(cfg.children);
        }

        super.initCfg(cfg);
    }
}