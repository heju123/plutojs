import {Controller,Component,Point,Particle,Cache} from "~/js/main";
import Particle1 from "./particle1";
import Particle2 from "./particle2";

export default class ParticleEffectsController extends Controller{
    private particle2Opts : any;

    constructor(component : Component) {
        super(component);

        (<Controller>this).registerEvent("$onViewLoaded", ()=>{
            let p : Particle;
            let cache1 : Cache = new Cache(8, 8);
            for (let i = 0; i <= 100; i++)
            {
                p = new Particle1((<Controller>this).component.getComponentByName("particle1"), 5000, cache1);
                (<Controller>this).component.getComponentByName("particle1").addParticle(p);
            }

            let cache2 : Cache = new Cache(4, 4);
            setInterval(()=>{
                p = new Particle2((<Controller>this).component.getComponentByName("particle2"), Math.random() * 200 + 1000,
                    cache2, this.particle2Opts);
                (<Controller>this).component.getComponentByName("particle2").addParticle(p);
            }, 1);
        });
    }

    onParticleAreaMouseMove(e){
        let particle2 = (<Controller>this).component.getComponentByName("particle2");

        this.particle2Opts = {
            x : e.pageX - particle2.getRealX(),
            y : e.pageY - particle2.getRealY()
        };
    }
}