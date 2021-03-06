import {Controller,Component,Router} from "~/js/main";

export default class NestRouteController extends Controller{
    private routeCom : Router;

    constructor(component : Component) {
        super(component);

        this.registerEvent("$onViewLoaded", ()=>{
            this.routeCom = <Router>this.component.getComponentById("nestRoute");
        })
    }

    changeRoute(routeName){
        this.routeCom.changeRoute(routeName);
    }
}