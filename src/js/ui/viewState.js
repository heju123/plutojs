/**
 * Created by heju on 2017/7/19.
 */
import commonUtil from "../util/commonUtil.js";
import Panel from "./components/panel.js";

export default class ViewState{
    constructor(viewCfg){
        this.rootPanel = new Panel();
        this.rootPanel.initCfg(viewCfg);
    }
}