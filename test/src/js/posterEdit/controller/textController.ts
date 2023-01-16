import {Controller,Component,Rect} from "~/js/main";

export default class TextController extends Controller{
    constructor(component : Component) {
        super(component);
    }

    selectText(e){
        if (this.component.parent.controller.selectedTextCom !== this){
            if (this.component.parent.controller.selectedTextCom){
                this.component.parent.controller.onDelSelect();
            }
            this.component.parent.controller.selectedTextCom = this.component;
            this.component.parent.controller.onSelect();
        }
        e.stopPropagation();
    }
}