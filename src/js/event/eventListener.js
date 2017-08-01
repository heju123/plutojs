//事件监听类
export default class EventListener {
    constructor(type, callback) {
        this.type = type;
        this.callback = callback;
    }

    setTarget(target)
    {
        this.target = target;
    }

    setSourceEvent(sourceEvent){
        this.sourceEvent = sourceEvent;
    }
}