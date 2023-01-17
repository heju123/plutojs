import {Controller,Component,Rect} from "~/js/main";

export default class ResizerController extends Controller{
    constructor(component : Component) {
        super(component);
    }

    resetBtnPos(resizeTop, resizeBottom){
        if (resizeTop){
            resizeTop.setY(-4)
        }
        if (resizeBottom){
            resizeBottom.setY(this.component.getHeight() - 6)
        }
    }

    init(){
        let resizeTop = this.component.getComponentByName('resizeTop');
        let resizeBottom = this.component.getComponentByName('resizeBottom');

        if (resizeTop){
            resizeTop.registerEvent("onDrag", (e)=> {
                if (e.currentTarget === resizeTop){
                    resizeTop.setX(resizeTop.parent.getWidth() / 2 - 10 / 2)
                    let newY = resizeTop.getRealY() - this.component.parent.getRealY() + 4;
                    let offset = this.component.getY() - newY;
                    let newHeight = this.component.getHeight() + offset;
                    this.resetBtnPos(resizeTop, resizeBottom)
                    if (newHeight >= 18){
                        this.component.setY(newY)
                        this.component.setHeight(newHeight)
                    }
                }
            });
            resizeTop.registerEvent("endDrag", (e)=> {
                if (e.currentTarget === resizeTop){
                    this.resetBtnPos(resizeTop, resizeBottom)
                }
            });
        }

        if (resizeBottom){
            resizeBottom.registerEvent("onDrag", (e)=> {
                if (e.currentTarget === resizeBottom){
                    resizeBottom.setX(resizeBottom.parent.getWidth() / 2 - 10 / 2)
                    let newHeight = resizeBottom.getRealY() - this.component.getRealY() + 4;
                    this.resetBtnPos(resizeTop, resizeBottom)
                    if (newHeight >= 18){
                        this.component.setHeight(newHeight)
                    }
                }
            });
            resizeBottom.registerEvent("endDrag", (e)=> {
                if (e.currentTarget === resizeBottom){
                    this.resetBtnPos(resizeTop, resizeBottom)
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