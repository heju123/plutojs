/**
 * Created by heju on 2017/7/25.
 */
import Event from "./event.js";

export default class ClickEvent extends Event{
    constructor(type, callback) {
        super(type, callback);
    }
}