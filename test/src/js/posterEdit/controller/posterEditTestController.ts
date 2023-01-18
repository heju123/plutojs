import {Controller,Component,Rect, commonUtil} from "~/js/main";
import textView from "../controls/text/view/textView";
import resizerView from "../controls/common/resizer/view/resizerView";
import posterPanelView from "../view/posterPanelView";

export default class PosterEditTestController extends Controller{
    constructor(component : Component) {
        super(component);
    }

    addPoster(){
        let editContent = this.viewState.getComponentByName('editContent');
        if (editContent){
            let component = new Rect(editContent);
            component.initCfg(posterPanelView('posterPanel', '/images/bg.jpeg', {
                x: editContent.getInnerWidth() / 2 - 380 / 2,
                y: editContent.getInnerHeight() / 2 - 620 / 2,
                width: 380,
                height: 620
            }))
            editContent.appendChild(component);
        }
    }

    addText(){
        let editContent = this.viewState.getComponentByName('editContent');
        if (editContent){
            let posterPanel = editContent.getComponentByName('posterPanel');
            if (posterPanel){
                let text1 = new Rect(posterPanel);
                text1.initCfg(resizerView('text1', {
                    x: posterPanel.getInnerWidth() / 2 - 100 / 2,
                    y: posterPanel.getInnerHeight() / 2 - 20 / 2,
                    width: 100,
                    height: 20
                }, textView('文本1文本1'))).then(()=>{
                    if (text1.controller){
                        text1.controller.init();
                    }
                });
                posterPanel.appendChild(text1);
            }
        }
    }

    exportImage(){
        let editContent = this.viewState.getComponentByName('editContent');
        if (editContent){
            let posterPanel = editContent.getComponentByName('posterPanel');
            if (posterPanel){
                let base64 = posterPanel.transform2Base64();
                console.log(base64)
                console.log(commonUtil.getFileByBase64(base64, 'test.png'))
            }
        }
    }
}