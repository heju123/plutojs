/**
 * Created by heju on 2017/7/26.
 */
import Event from "./event";

export default class KeyEvent extends Event{
    key : string;
    keyCode : number;

    constructor(type : string) {
        super(type);

        this.key = undefined;
        this.keyCode = undefined;
    }

    setKey(key : string){
        this.key = key;
    }

    setKeyCode(keyCode : number){
        this.keyCode = keyCode;
    }
}