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
            this.controller.doWork();
        }
        if (cfg.children)
        {
            this.children = [];
            let chiCfg;
            for (let i = 0, j = cfg.children.length; i < j; i++)
            {
                chiCfg = cfg.children[i];
                switch (chiCfg.type)
                {
                    case "panel" :
                        let panel = new Panel(chiCfg);
                        this.children.push(panel);
                        break;
                    default : break;
                }
            }
        }
    }
}