import Event from "./event.js";

export default class WheelEvent extends Event{
    wheelDelta : number;

    constructor(type : string) {
        super(type);

        this.wheelDelta = undefined;
    }

    setWheelDelta(wheelDelta : number){
        this.wheelDelta = wheelDelta;
    }
}