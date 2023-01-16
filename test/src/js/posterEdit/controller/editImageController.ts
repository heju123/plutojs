import {Controller,Component,Rect} from "~/js/main";

export default class EditImageController extends Controller{
    public selectedTextCom: Component;

    constructor(component : Component) {
        super(component);
    }

    clearSelect(){
        if (this.selectedTextCom){
            this.onDelSelect()
            this.selectedTextCom = undefined;
        }
    }

    onSelect(){
        if (this.selectedTextCom){
            this.selectedTextCom.setStyle('borderColor', '#6CCFFF')
        }
    }

    onDelSelect(){
        if (this.selectedTextCom){
            this.selectedTextCom.setStyle('borderColor', undefined)
        }
    }
}