import {Controller,Component} from "~/js/main";

export default class NavController extends Controller{
    constructor(component : Component) {
        super(component);
    }

    goLink(routeName, e){
        let mainRoute = this.viewState.getComponentById("mainRoute");
        mainRoute.changeRoute(routeName);
    }
}