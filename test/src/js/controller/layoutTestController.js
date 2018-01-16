import {Controller} from "../../../../src/js/main";

export default class LayoutTestController extends Controller{
    constructor(component) {
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