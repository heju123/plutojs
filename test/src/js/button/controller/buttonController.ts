import {Controller,Component} from "~/js/main";

export default class ButtonController extends Controller{
    constructor(component : Component) {
        super(component);
    }

    testClick(){
        console.log("click!");
    }
}