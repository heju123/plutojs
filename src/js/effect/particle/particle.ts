import Component from "../../ui/components/component";
import Physics from "../physics/physics";

interface Particle{
    x : number;
    y : number;
    xSpeed : number;
    ySpeed : number;
    xAcceleration : number;
    yAcceleration : number;

    //父组件
    component : Component;

    //是否存活
    alive : boolean;

    //存活时间，单位：毫秒，-1：永久
    lifeTime : number;

    draw(ctx : CanvasRenderingContext2D) : boolean;

    addPhysics(physics : Physics);

    beforeMount() : void;
    mounted() : void;
    beforeDestroy() : void;
    destroyed() : void;

    setX(x : number);
    setY(y : number);
    getX() : number;
    getY() : number;
    getRealX() : number;
    getRealY() : number;
}
export default Particle;