/**
 * Created by heju on 2017/7/20.
 */
import Rect from "./base/rect.js"

export default class Panel extends Rect{
    constructor(cfg){
        super(cfg.style);

        if (cfg.controller && typeof(cfg.controller) == "function")
        {
            this.controller = new cfg.controller(this);
        }
        else if (cfg.getController && typeof(cfg.getController) == "function")
        {
            cfg.getController(this.asyncGetController.bind(this));
        }
        else
        {
            console.error("无法创建controller，controller配置错误！");
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

    asyncGetController(controller){
        if (controller && typeof(controller) == "function")
        {
            this.controller = new controller(this);
        }
        else
        {
            console.error("无法创建controller，controller配置错误！");
        }
    }
}