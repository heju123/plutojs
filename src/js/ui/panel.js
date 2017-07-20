/**
 * Created by heju on 2017/7/20.
 */
import Rect from "./base/rect.js"

export default class Panel extends Rect{
    constructor(cfg){
        super(cfg.style);

        if (cfg.controller)
        {
            this.controller = new cfg.controller();
        }
        if (cfg.children)
        {
            this.children = [];
            let chiCfg;
            let childCom;
            for (let i = 0, j = cfg.children.length; i < j; i++)
            {
                chiCfg = cfg.children[i];
                switch (chiCfg.type)
                {
                    case "panel" :
                        childCom = new Panel(chiCfg);
                        childCom.parent = this;
                        this.children.push(childCom);
                        break;
                    default : break;
                }
            }
        }
    }
}