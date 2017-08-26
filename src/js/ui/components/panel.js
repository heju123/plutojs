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
        super.initCfg(cfg);
        if (cfg.children)
        {
            this.initChildrenCfg(cfg.children);
        }
    }

    appendChildren(child){
        super.appendChildren(child);

        this.doLayout();
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
                    let allWeight = this.getAllWeight();//总权值
                    let allWH = 0;//记录高宽，确定x和y坐标
                    this.children.forEach((child, index)=>{
                        let weight = 1;
                        if (child.style.layout && child.style.layout.layoutWeight)
                        {
                            weight = child.style.layout.layoutWeight;
                        }
                        if (!this.style.layout.orientation || this.style.layout.orientation === "horizontal")
                        {
                            let width = (this.getWidth() - (this.style.borderWidth || 0) * 2) * (weight / allWeight);
                            child.setX(allWH);
                            child.setY(0);
                            child.setWidth(width);
                            allWH += width;
                        }
                        else if (this.style.layout.orientation === "vertical")
                        {
                            let height = (this.getHeight() - (this.style.borderWidth || 0) * 2) * (weight / allWeight);
                            child.setY(allWH);
                            child.setX(0);
                            child.setHeight(height);
                            allWH += height;
                        }
                    });
                    break;
                default : break;
            }
        }
    }
}