/**
 * Created by heju on 2017/7/20.
 */
import {Controller,Component} from "~/js/main";

export default class ChildController extends Controller{
    constructor(component : Component) {
        super(component);

        this.component.registerEvent("mousedown", this.mousedownPanel.bind(this, 1));

        this.component.registerEvent("mousedown", this.mousedownPanel.bind(this, 2));
    }

    mousedownPanel(num, e){
        console.log(num);
        //console.log(e);
        e.stopImmediatePropagation();
        e.stopPropagation();
    }
}