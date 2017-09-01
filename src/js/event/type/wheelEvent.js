import Event from "./event.js";

export default class WheelEvent extends Event{
    constructor(type) {
        super(type);

        this.wheelDelta = undefined;
    }

    setWheelDelta(wheelDelta){
        this.wheelDelta = wheelDelta;
    }
}