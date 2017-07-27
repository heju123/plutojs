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
}