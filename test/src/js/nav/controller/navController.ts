import {Controller,Component} from "~/js/main";

export default class NavController extends Controller{
    constructor(component : Component) {
        super(component);
    }

    onClickItem(e){
        console.log(e);
    }
}