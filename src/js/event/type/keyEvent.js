/**
 * Created by heju on 2017/7/26.
 */
import Event from "./event.js";

export default class KeyEvent extends Event{
    constructor(type) {
        super(type);

        this.key = undefined;
        this.keyCode = undefined;
    }

    setKey(key){
        this.key = key;
    }

    setKeyCode(keyCode){
        this.keyCode = keyCode;
    }
}