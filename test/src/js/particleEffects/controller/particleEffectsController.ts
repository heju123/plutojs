import {Controller,Component,Point,Particle} from "~/js/main";
import Particle1 from "./particle1";

export default class ParticleEffectsController extends Controller{

    constructor(component : Component) {
        super(component);

        (<Controller>this).registerEvent("$onViewLoaded", ()=>{
            let p : Particle = new Particle1((<Controller>this).component.getComponentByName("particle1"), 5000);
            (<Controller>this).component.getComponentByName("particle1").addParticle(p);
        });
    }
}