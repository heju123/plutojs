/**
 * Created by heju on 2017/7/25.
 */
import Event from "./event.js";

export default class DragEvent extends Event{
    constructor(type) {
        super(type);

        this.pageX = undefined;
        this.pageY = undefined;
    }

    setPageX(x){
        this.pageX = x;
    }

    setPageY(y){
        this.pageY = y;
    }
}