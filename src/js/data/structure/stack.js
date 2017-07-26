/**
 * Created by heju on 2017/7/26.
 */
export default class Stack{
    constructor() {
    }

    push(obj){
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
        let ret;
        if (this.top)
        {
            ret = this.top.value;
        }
        this.top = this.top.next;
        return ret;
    }
}