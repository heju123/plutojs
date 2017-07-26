/**
 * Created by heju on 2017/7/26.
 */
//事件通知类
export default class EventNotify {
    constructor() {
        this.clearEventNotify();
    }

    /**
     * 设置通知，下次循环draw的时候用这些值判断是否触发事件
     */
    set(obj){
        this.type = obj.type;
        this.px = obj.px;
        this.py = obj.py;
        this.event = obj.event;
    }

    clearEventNotify(){
        this.type = undefined;//1：鼠标相关事件；2：键盘事件
        this.px = undefined;
        this.py = undefined;
        this.event = undefined;
    }
}