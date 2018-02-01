import EffectReject from "./effectReject";

export default class CollisionReject extends EffectReject{
    private direction : string;

    constructor(name, data, direction){
        super(name, data);
        this.direction = direction;
    }
}