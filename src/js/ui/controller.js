/**
 * Created by heju on 2017/7/21.
 */
import globalUtil from "../util/globalUtil";

export default class Controller{
    constructor(panel) {
        this.panel = panel;
        this.viewState = globalUtil.viewState;
    }
}