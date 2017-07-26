/**
 * Created by heju on 2017/7/20.
 */
import Rect from "./rect.js"

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
            this.children = [];
            let chiCfg;
            let childCom;
            for (let i = 0, j = cfg.children.length; i < j; i++)
            {
                chiCfg = cfg.children[i];
                if (typeof(chiCfg) == "function")//异步加载view
                {
                    chiCfg(this.asyncGetView.bind(this));
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
                        default : break;
                    }
                }
            }
        }

        super.initCfg(cfg);
    }

    asyncGetView(viewCfg){
        let panel = new Panel(this);
        panel.initCfg(viewCfg);
        this.children.push(panel);
    }
}