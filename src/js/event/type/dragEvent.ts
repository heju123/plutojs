/**
 * Created by heju on 2017/7/25.
 */
import Event from "./event";

export default class DragEvent extends Event{
    pageX : number;
    pageY : number;

    constructor(type : string) {
        super(type);

        this.pageX = undefined;
        this.pageY = undefined;
    }

    setPageX(x : number){
        this.pageX = x;
    }

    setPageY(y : number){
        this.pageY = y;
    }
}