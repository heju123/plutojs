/**
 * Created by heju on 2017/7/26.
 */
import Event from "./event.js";

export default class MouseEvent extends Event{
    constructor(type, callback) {
        super(type, callback);

        this.pageX = undefined;
        this.pageY = undefined;
        this.button = undefined;
    }

    setPageX(x){
        this.pageX = x;
    }

    setPageY(y){
        this.pageY = y;
    }

    setButton(button){
        this.button = button;
    }
}