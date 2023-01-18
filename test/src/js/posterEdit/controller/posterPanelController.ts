import {Controller,Component,Rect} from "~/js/main";

export default class PosterPanelController extends Controller{
    public selectedCom: Component;

    constructor(component : Component) {
        super(component);
    }

    clearSelect(){
        this.setSelectedCom(undefined)
    }

    setSelectedCom(selectedCom?: Component){
        if (this.selectedCom){
            this.selectedCom.setStyle('borderColor', undefined)
            this.selectedCom.getComponentByName('resizeTop').style.alpha = 0;
            this.selectedCom.getComponentByName('resizeTopRight').style.alpha = 0;
            this.selectedCom.getComponentByName('resizeRight').style.alpha = 0;
            this.selectedCom.getComponentByName('resizeBottomRight').style.alpha = 0;
            this.selectedCom.getComponentByName('resizeBottom').style.alpha = 0;
            this.selectedCom.getComponentByName('resizeBottomLeft').style.alpha = 0;
            this.selectedCom.getComponentByName('resizeLeft').style.alpha = 0;
            this.selectedCom.getComponentByName('resizeTopLeft').style.alpha = 0;
            this.selectedCom = undefined;
        }
        if (selectedCom){
            this.selectedCom = selectedCom;
            if (this.selectedCom){
                this.selectedCom.setStyle('borderColor', '#6CCFFF')
                this.selectedCom.getComponentByName('resizeTop').style.alpha = 1;
                this.selectedCom.getComponentByName('resizeTopRight').style.alpha = 1;
                this.selectedCom.getComponentByName('resizeRight').style.alpha = 1;
                this.selectedCom.getComponentByName('resizeBottomRight').style.alpha = 1;
                this.selectedCom.getComponentByName('resizeBottom').style.alpha = 1;
                this.selectedCom.getComponentByName('resizeBottomLeft').style.alpha = 1;
                this.selectedCom.getComponentByName('resizeLeft').style.alpha = 1;
                this.selectedCom.getComponentByName('resizeTopLeft').style.alpha = 1;
            }
        }
    }
}