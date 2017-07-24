/**
 * Created by heju on 2017/7/20.
 */
import Rect from "./base/rect.js"

export default class Panel extends Rect{
    constructor(cfg){
        super(cfg);

        if (cfg.controller && typeof(cfg.controller) == "function")
        {
            this.controller = new cfg.controller(this);
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
                if (typeof(chiCfg) == "function")//异步加载view
                {
                    chiCfg(this.asyncGetView.bind(this));
                }
                else
                {
                    switch (chiCfg.type)
                    {
                        case "panel" :
                            childCom = new Panel(chiCfg);
                            childCom.parent = this;
                            this.children.push(childCom);
                            break;
                        case "rect" :
                            childCom = new Rect(chiCfg);
                            childCom.parent = this;
                            this.children.push(childCom);
                            break;
                        default : break;
                    }
                }
            }
        }
    }

    asyncGetView(viewCfg){
        let panel = new Panel(viewCfg);
        panel.parent = this;
        this.children.push(panel);
    }
}