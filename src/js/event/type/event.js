/**
 * Created by heju on 2017/7/25.
 */
export default class Event {
    constructor(type) {
        this.type = type;
        this.propagation = true;
        this.immediatePropagation = true;
    }

    setTarget(target) {
        this.target = target;//触发事件对象
    }

    setCurrentTarget(target) {
        this.currentTarget = target;//绑定事件对象
    }

    stopPropagation()
    {
        this.propagation = false;
    }

    stopImmediatePropagation(){
        this.immediatePropagation = false;
    }
}