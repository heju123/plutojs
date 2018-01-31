import {Controller,Component,Rect} from "~/js/main";

export default class CliptestController extends Controller{
    constructor(component : Component) {
        super(component);

        this.registerEvent("$onViewLoaded", ()=>{
        });
    }

    zoomIn(comId){
        let com : Component = this.component.getComponentById(comId);
        let scalearr : Array<string> = com.style.scale.split(",");
        com.setStyle("scale", (parseFloat(scalearr[0]) + 0.1) + "," + (parseFloat(scalearr[1]) + 0.1));
    }

    zoomOut(comId){
        let com : Component = this.component.getComponentById(comId);
        let scalearr : Array<string> = com.style.scale.split(",");
        com.setStyle("scale", (parseFloat(scalearr[0]) - 0.1) + "," + (parseFloat(scalearr[1]) - 0.1));
    }
}