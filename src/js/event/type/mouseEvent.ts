/**
 * Created by heju on 2017/7/26.
 */
import Event from "./event";

export default class MouseEvent extends Event{
    pageX : number;
    pageY : number;
    button : number;

    constructor(type : string) {
        super(type);

        this.pageX = undefined;
        this.pageY = undefined;
        this.button = undefined;
    }

    setPageX(x : number){
        this.pageX = x;
    }

    setPageY(y : number){
        this.pageY = y;
    }

    setButton(button : number){
        this.button = button;
    }
}