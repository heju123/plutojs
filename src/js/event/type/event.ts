/**
 * Created by heju on 2017/7/25.
 */
export default class Event {
    type : string;
    private propagation : boolean;
    private immediatePropagation : boolean;
    target : any;
    currentTarget : any;
    sourceEvent : any;

    constructor(type : string) {
        this.type = type;
        this.propagation = true;
        this.immediatePropagation = true;
    }

    setTarget(target : any) {
        this.target = target;//触发事件对象
    }

    setCurrentTarget(target : any) {
        this.currentTarget = target;//绑定事件对象
    }

    //设置浏览器事件对象
    setSourceEvent(event : any) {
        this.sourceEvent = event;
    }

    stopPropagation()
    {
        this.propagation = false;
    }

    stopImmediatePropagation(){
        this.immediatePropagation = false;
    }
}