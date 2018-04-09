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

    readyToDraw(ctx : CanvasRenderingContext2D);
    draw(ctx : CanvasRenderingContext2D);

    addPhysics(physics : Physics);

    beforeMount() : void;
    mounted() : void;
    beforeDestroy() : Promise<any>;
    destroyed() : void;

    setX(x : number);
    setY(y : number);
    getX() : number;
    getY() : number;
    getRealX() : number;
    getRealY() : number;
}
export default Particle;