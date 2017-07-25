/**
 * Created by heju on 2017/7/25.
 */
export default class Event {
    constructor(type, callback) {
        this.type = type;
        this.callback = callback;
    }

    setTarget(target) {
        this.target = target;
    }
}