import EffectReject from "./effectReject";

export default class CollisionReject extends EffectReject{
    direction : string;

    constructor(data : any, direction : string){
        super(data);
        this.direction = direction;
    }
}