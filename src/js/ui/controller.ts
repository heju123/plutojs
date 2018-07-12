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
        this.viewState = this.component.viewState;
    }

    /** 用相对坐标获取显示在界面上的真实坐标 */
    getDrawX(x){
        return x + this.component.getRealX();
    }
    getDrawY(y){
        return y + this.component.getRealY();
    }
    //显示在界面上的真实坐标转换为相对坐标
    getX(drawX){
        return drawX - this.component.getRealX();
    }
    getY(drawY){
        return drawY - this.component.getRealY();
    }

    registerEvent(eventType : string, callback : Function | string){
        globalUtil.eventBus.registerEvent(this, eventType, callback);
    }

    removeEvent(eventType : string, callback : Function | string){
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