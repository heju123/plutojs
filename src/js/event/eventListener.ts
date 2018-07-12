import evalUtil from "../util/evalUtil";

//事件监听类
export default class EventListener {
    type : string;
    target : any;
    callback : Function | string;

    constructor(type : string, callback : Function | string) {
        this.type = type;
        this.callback = callback;
    }

    executeCallback(event){
        let controller = this.target.getController ? this.target.getController(this.target) : undefined;
        if (typeof(this.callback) === 'function')
        {
            this.callback(event);
        }
        else if (typeof(this.callback) === 'string' && controller)
        {
            let params = [];
            let functionInfo = evalUtil.evalFunction(this.callback, this.target);
            if (functionInfo.params.length > 0)
            {
                params = params.concat(functionInfo.params);
            }
            params.push(event);
            if (controller[functionInfo.name] && typeof(controller[functionInfo.name]) === 'function')
            {
                controller[functionInfo.name].apply(controller, params);
            }
        }
    }

    setTarget(target : any)
    {
        this.target = target;
    }
}