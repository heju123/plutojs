/**
 * Created by heju on 2017/7/19.
 */
import commonUtil from "../util/commonUtil.js";
import Panel from "./panel.js";

export default class ViewState{
    constructor(viewCfg){
        this.rootPanel = new Panel(viewCfg);
    }
}