/**
 * Created by heju on 2017/7/19.
 */
import globalUtil from "../util/globalUtil.js";
import commonUtil from "../util/commonUtil.js";
import Panel from "./components/panel.js";
import Router from "./components/router.js";

export default class ViewState{
    constructor(){
    }

    init(viewCfg){
        if (viewCfg.type == "panel")
        {
            this.rootPanel = new Panel();
            this.rootPanel.initCfg(viewCfg);
        }
        else if (viewCfg.type == "route")
        {
            this.rootPanel = new Router();
            this.rootPanel.initCfg(viewCfg);
        }
    }

    getComponentInChildrenById(id, com) {
        let children = com.getChildren();
        if (children)
        {
            let retCom;
            if (children instanceof Array)
            {
                let child;
                for (let i = 0, j = children.length; i < j; i++)
                {
                    child = children[i];
                    if (child.id && child.id === id)
                    {
                        return child;
                    }
                    retCom = this.getComponentInChildrenById(id, child);
                    if (retCom)
                    {
                        return retCom;
                    }
                    if (i == j - 1)
                    {
                        return undefined;
                    }
                }
            }
            else
            {
                if (children.id && children.id === id)
                {
                    return children;
                }
                else
                {
                    return this.getComponentInChildrenById(id, children);
                }
            }
        }
        else
        {
            return undefined;
        }
    }

    getComponentById(id){
        if (this.rootPanel.id && this.rootPanel.id === id)
        {
            return this.rootPanel;
        }
        else
        {
            return this.getComponentInChildrenById(id, this.rootPanel);
        }
    }
}