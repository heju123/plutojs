/**
 * Created by heju on 2017/7/21.
 */
import globalUtil from "../util/globalUtil";
import Component from "./components/component";
import ViewState from "./viewState";

export default class Controller{
    component : Component;
    viewState : ViewState;

    constructor(component : Component) {
        this.component = component;
        this.viewState = globalUtil.viewState;
    }

    registerEvent(eventType : string, callback : Function){
        globalUtil.eventBus.registerEvent(this, eventType, callback);
    }

    removeEvent(eventType : string, callback : Function){
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