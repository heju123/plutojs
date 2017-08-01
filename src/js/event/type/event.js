/**
 * Created by heju on 2017/7/25.
 */
export default class Event {
    constructor(type) {
        this.type = type;
    }

    setTarget(target) {
        this.target = target;
    }

    setCurrentTarget(target) {
        this.currentTarget = target;
    }
}