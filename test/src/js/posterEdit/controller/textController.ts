import {Controller,Component,Rect} from "~/js/main";

export default class TextController extends Controller{
    constructor(component : Component) {
        super(component);
    }

    init(){
        let resizeTop = this.component.getComponentByName('resizeTop');
        if (resizeTop){
            resizeTop.registerEvent("onDrag", (e)=> {
                if (e.currentTarget === resizeTop){
                    resizeTop.setX(resizeTop.parent.getWidth() / 2 - 10 / 2)
                    let newY = resizeTop.getRealY() - this.component.parent.getRealY() + 4;
                    let offset = this.component.getY() - newY;
                    let newHeight = this.component.getHeight() + offset;
                    if (newHeight >= 18){
                        this.component.setY(newY)
                        this.component.setHeight(newHeight)
                    }
                    else {
                        resizeTop.setY(-4)
                    }
                }
            });
            resizeTop.registerEvent("endDrag", (e)=> {
                if (e.currentTarget === resizeTop){
                    resizeTop.setY(-4)
                }
            });
        }
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