import {Controller,Component} from "~/js/main";

export default class TopController extends Controller{
    constructor(component : Component) {
        super(component);
    }

    goHome(){
        let mainRoute = this.viewState.getComponentById("mainRoute");
        mainRoute.changeRoute("nav");
    }
}