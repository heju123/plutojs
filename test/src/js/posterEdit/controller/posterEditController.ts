import {Controller,Component,Rect} from "~/js/main";
import editImageView from "../view/editImageView";
import textView from "../view/textView";

export default class PosterEditController extends Controller{
    constructor(component : Component) {
        super(component);
    }

    addPoster(){
        let editContent = this.viewState.getComponentByName('editContent');
        if (editContent){
            let component = new Rect(editContent);
            component.initCfg(editImageView('editImage1', '/images/bg.jpeg', {
                x: 100,
                y: 100
            }))
            editContent.appendChild(component);
        }
    }

    addText(){
        let editContent = this.viewState.getComponentByName('editContent');
        if (editContent){
            let editImage1 = editContent.getComponentByName('editImage1');
            if (editImage1){
                let text1 = new Rect(editImage1);
                text1.initCfg(textView('text1', {
                    x: 100,
                    y: 100
                }))
                editImage1.appendChild(text1);
            }
        }
    }
}