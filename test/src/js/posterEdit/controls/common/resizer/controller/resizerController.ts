import {Controller,Component,Rect} from "~/js/main";

export default class ResizerController extends Controller{
    constructor(component : Component) {
        super(component);
    }

    init(){
        let resizeTop = this.component.getComponentByName('resizeTop');
        let resizeTopRight = this.component.getComponentByName('resizeTopRight');
        let resizeRight = this.component.getComponentByName('resizeRight');
        let resizeBottomRight = this.component.getComponentByName('resizeBottomRight');
        let resizeBottom = this.component.getComponentByName('resizeBottom');
        let resizeBottomLeft = this.component.getComponentByName('resizeBottomLeft');
        let resizeLeft = this.component.getComponentByName('resizeLeft');
        let resizeTopLeft = this.component.getComponentByName('resizeTopLeft');

        this.resetBtnPos(resizeTop, resizeTopRight, resizeRight, resizeBottomRight, resizeBottom, resizeBottomLeft, resizeLeft, resizeTopLeft)

        if (resizeTop){
            resizeTop.registerEvent("onDrag", (e)=> {
                let newY = resizeTop.getRealY() + 4;
                let offset = this.component.getRealY() - newY;
                let newHeight = this.component.getHeight() + offset;
                if (newHeight >= 20){
                    this.component.setRealY(newY)
                    this.component.setHeight(newHeight)
                }
                this.resetBtnPos(resizeTop, resizeTopRight, resizeRight, resizeBottomRight, resizeBottom, resizeBottomLeft, resizeLeft, resizeTopLeft)
            });
            resizeTop.registerEvent("endDrag", (e)=> {
                this.resetBtnPos(resizeTop, resizeTopRight, resizeRight, resizeBottomRight, resizeBottom, resizeBottomLeft, resizeLeft, resizeTopLeft)
                this.reCalTextWidth();
            });
        }

        if (resizeTopRight){
            resizeTopRight.registerEvent("onDrag", (e)=> {
                let newY = resizeTopRight.getRealY() + 3;
                let offset = this.component.getRealY() - newY;
                let newHeight = this.component.getHeight() + offset;
                if (newHeight >= 20){
                    this.component.setRealY(newY)
                    this.component.setHeight(newHeight)
                }

                let newWidth = resizeTopRight.getRealX() - this.component.getRealX() + 3;
                if (newWidth >= 50){
                    this.component.setWidth(newWidth)
                }
                this.resetBtnPos(resizeTop, resizeTopRight, resizeRight, resizeBottomRight, resizeBottom, resizeBottomLeft, resizeLeft, resizeTopLeft)
            });
            resizeTopRight.registerEvent("endDrag", (e)=> {
                this.resetBtnPos(resizeTop, resizeTopRight, resizeRight, resizeBottomRight, resizeBottom, resizeBottomLeft, resizeLeft, resizeTopLeft)
                this.reCalTextWidth();
            });
        }

        if (resizeRight){
            resizeRight.registerEvent("onDrag", (e)=> {
                let newWidth = resizeRight.getRealX() - this.component.getRealX() + 4;
                if (newWidth >= 50){
                    this.component.setWidth(newWidth)
                }
                this.resetBtnPos(resizeTop, resizeTopRight, resizeRight, resizeBottomRight, resizeBottom, resizeBottomLeft, resizeLeft, resizeTopLeft)
            });
            resizeRight.registerEvent("endDrag", (e)=> {
                this.resetBtnPos(resizeTop, resizeTopRight, resizeRight, resizeBottomRight, resizeBottom, resizeBottomLeft, resizeLeft, resizeTopLeft)
                this.reCalTextWidth();
            });
        }

        if (resizeBottomRight){
            resizeBottomRight.registerEvent("onDrag", (e)=> {
                let newWidth = resizeBottomRight.getX() + 3;
                if (newWidth >= 50){
                    this.component.setWidth(newWidth)
                }
                let newHeight = resizeBottomRight.getY() + 3
                if (newHeight >= 20){
                    this.component.setHeight(newHeight)
                }
                this.resetBtnPos(resizeTop, resizeTopRight, resizeRight, resizeBottomRight, resizeBottom, resizeBottomLeft, resizeLeft, resizeTopLeft)
            });
            resizeBottomRight.registerEvent("endDrag", (e)=> {
                this.resetBtnPos(resizeTop, resizeTopRight, resizeRight, resizeBottomRight, resizeBottom, resizeBottomLeft, resizeLeft, resizeTopLeft)
                this.reCalTextWidth();
            });
        }

        if (resizeBottom){
            resizeBottom.registerEvent("onDrag", (e)=> {
                let newHeight = resizeBottom.getRealY() - this.component.getRealY() + 4;
                if (newHeight >= 20){
                    this.component.setHeight(newHeight)
                }
                this.resetBtnPos(resizeTop, resizeTopRight, resizeRight, resizeBottomRight, resizeBottom, resizeBottomLeft, resizeLeft, resizeTopLeft)
            });
            resizeBottom.registerEvent("endDrag", (e)=> {
                this.resetBtnPos(resizeTop, resizeTopRight, resizeRight, resizeBottomRight, resizeBottom, resizeBottomLeft, resizeLeft, resizeTopLeft)
                this.reCalTextWidth();
            });
        }

        if (resizeBottomLeft){
            resizeBottomLeft.registerEvent("onDrag", (e)=> {
                let newX = resizeBottomLeft.getRealX() - 2;
                let offset = this.component.getRealX() - newX;
                let newWidth = this.component.getWidth() + offset
                if (newWidth >= 50){
                    this.component.setRealX(newX)
                    this.component.setWidth(newWidth)
                }

                let newHeight = resizeBottomLeft.getRealY() - this.component.getRealY()
                if (newHeight >= 20){
                    this.component.setHeight(newHeight)
                }
                this.resetBtnPos(resizeTop, resizeTopRight, resizeRight, resizeBottomRight, resizeBottom, resizeBottomLeft, resizeLeft, resizeTopLeft)
            });
            resizeBottomLeft.registerEvent("endDrag", (e)=> {
                this.resetBtnPos(resizeTop, resizeTopRight, resizeRight, resizeBottomRight, resizeBottom, resizeBottomLeft, resizeLeft, resizeTopLeft)
                this.reCalTextWidth();
            });
        }

        if (resizeLeft){
            resizeLeft.registerEvent("onDrag", (e)=> {
                let newX = resizeLeft.getRealX() + 4;
                let offset = this.component.getRealX() - newX;
                let newWidth = this.component.getWidth() + offset;
                if (newWidth >= 50){
                    this.component.setRealX(newX)
                    this.component.setWidth(newWidth)
                }
                this.resetBtnPos(resizeTop, resizeTopRight, resizeRight, resizeBottomRight, resizeBottom, resizeBottomLeft, resizeLeft, resizeTopLeft)
            });
            resizeLeft.registerEvent("endDrag", (e)=> {
                this.resetBtnPos(resizeTop, resizeTopRight, resizeRight, resizeBottomRight, resizeBottom, resizeBottomLeft, resizeLeft, resizeTopLeft)
                this.reCalTextWidth();
            });
        }

        if (resizeTopLeft){
            resizeTopLeft.registerEvent("onDrag", (e)=> {
                let newX = resizeTopLeft.getRealX() - 2;
                let offset = this.component.getRealX() - newX;
                let newWidth = this.component.getWidth() + offset
                if (newWidth >= 50){
                    this.component.setRealX(newX)
                    this.component.setWidth(newWidth)
                }

                let newY = resizeTopLeft.getRealY() + 3;
                offset = this.component.getRealY() - newY;
                let newHeight = this.component.getHeight() + offset
                if (newHeight >= 20){
                    this.component.setRealY(newY)
                    this.component.setHeight(newHeight)
                }
                this.resetBtnPos(resizeTop, resizeTopRight, resizeRight, resizeBottomRight, resizeBottom, resizeBottomLeft, resizeLeft, resizeTopLeft)
            });
            resizeTopLeft.registerEvent("endDrag", (e)=> {
                this.resetBtnPos(resizeTop, resizeTopRight, resizeRight, resizeBottomRight, resizeBottom, resizeBottomLeft, resizeLeft, resizeTopLeft)
                this.reCalTextWidth();
            });
        }
    }

    resetBtnPos(resizeTop, resizeTopRight, resizeRight, resizeBottomRight, resizeBottom, resizeBottomLeft, resizeLeft, resizeTopLeft){
        if (resizeTop){
            resizeTop.setX(this.component.getInnerWidth() / 2 - 10 / 2)
            resizeTop.setY(-2)
        }
        if (resizeTopRight){
            resizeTopRight.setX(this.component.getInnerWidth() - 2)
            resizeTopRight.setY(-2)
        }
        if (resizeRight){
            resizeRight.setY(this.component.getInnerHeight() / 2 - 10 / 2)
            resizeRight.setX(this.component.getInnerWidth() - 2)
        }
        if (resizeBottomRight){
            resizeBottomRight.setX(this.component.getInnerWidth() - 3)
            resizeBottomRight.setY(this.component.getInnerHeight() - 3)
        }
        if (resizeBottom){
            resizeBottom.setX(this.component.getInnerWidth() / 2 - 10 / 2)
            resizeBottom.setY(this.component.getInnerHeight() - 2)
        }
        if (resizeBottomLeft){
            resizeBottomLeft.setX(-2)
            resizeBottomLeft.setY(this.component.getInnerHeight() - 2)
        }
        if (resizeLeft){
            resizeLeft.setY(this.component.getInnerHeight() / 2 - 10 / 2)
            resizeLeft.setX(-2)
        }
        if (resizeTopLeft){
            resizeTopLeft.setX(-2)
            resizeTopLeft.setY(-2)
        }
    }

    // 重新设置文本，好触发自动换行算法
    reCalTextWidth(){
        let textComs = this.component.getComponentsByName('textCom');
        if (textComs && textComs.length > 0){
            textComs.forEach((tc)=>{
                tc.setText(tc.getText().replace(/\n/g, ''))
            })
        }
    }

    selectText(e){
        if (this.component.parent.controller.selectedTextCom !== this){
            this.component.parent.controller.setSelectedCom(this.component);
        }
        e.stopPropagation();
    }
}