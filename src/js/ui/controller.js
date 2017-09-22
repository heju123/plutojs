/**
 * Created by heju on 2017/7/21.
 */
import globalUtil from "../util/globalUtil";

export default class Controller{
    constructor(panel) {
        this.panel = panel;
        this.viewState = globalUtil.viewState;
    }

    registerEvent(eventType, callback){
        globalUtil.eventBus.registerEvent(this, eventType, callback);
    }

    removeEvent(eventType, callback){
        globalUtil.eventBus.removeEvent(this, eventType, callback);
    }

    removeAllEvent()
    {
        globalUtil.eventBus.removeAllEvent(this);
    }

    destroy()
    {
        this.removeAllEvent();
    }
}