/**
 * Created by heju on 2017/7/26.
 */
export default class Stack{
    top : Object;

    constructor() {
    }

    push(obj : any){
        if (obj)
        {
            let data;
            if (!this.top)
            {
                data = {
                    value : obj
                };
            }
            else
            {
                data = {
                    value : obj,
                    next : this.top
                };
            }
            this.top = data;
        }
    }

    pop(){
        if (!this.top)
        {
            return undefined;
        }
        let ret : any;
        if (this.top)
        {
            ret = (<any>this.top).value;
        }
        this.top = (<any>this.top).next;
        return ret;
    }

    getTop(){
        return this.top ? (<any>this.top).value : undefined;
    }
}