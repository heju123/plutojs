//事件监听类
export default class EventListener {
    type : string;
    target : any;
    callback : Function;

    constructor(type : string, callback : Function) {
        this.type = type;
        this.callback = callback;
    }

    setTarget(target : any)
    {
        this.target = target;
    }
}