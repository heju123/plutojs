import {Controller,Component,Point,Particle} from "~/js/main";
import Particle1 from "./particle1";

export default class ParticleEffectsController extends Controller{

    constructor(component : Component) {
        super(component);

        (<Controller>this).registerEvent("$onViewLoaded", ()=>{
            let p : Particle;
            for (let i = 0; i <= 100; i++)
            {
                p = new Particle1((<Controller>this).component.getComponentByName("particle1"), 20000);
                (<Controller>this).component.getComponentByName("particle1").addParticle(p);
            }
        });
    }
}