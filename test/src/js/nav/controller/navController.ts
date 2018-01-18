import {Controller,Component} from "~/js/main";

export default class NavController extends Controller{
    constructor(component : Component) {
        super(component);
    }

    goLink(param, e){
        console.log(param[0]);
    }
}