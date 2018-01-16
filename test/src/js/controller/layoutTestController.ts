import {Controller,Component} from "~/js/main";

export default class LayoutTestController extends Controller{
    constructor(component : Component) {
        super(component);
    }

    clickGreen(e){
        console.log("green");
    }

    removeEvent(e){
        let com = this.viewState.getComponentById("layout_rectGreen");
        com.removeAllEvent();
    }
}