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
                    y: posterPanel.getInnerHeight() / 2 - 30 / 2,
                    width: 100,
                    height: 50
                }, textView('文本1文本1', {
                    fontSize: '38px'
                }))).then(()=>{
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

    changeFontFamily(){
        let posterPanel = this.viewState.getComponentByName('posterPanel');
        if (posterPanel && posterPanel.controller.selectedCom){
            let textCom = posterPanel.controller.selectedCom.getComponentByName('textCom')
            if (!textCom){
                return;
            }
            let name = 'hanyijielongtaohuayuan'
            // 检验字体是否已经安装
            if ((document as any).fonts.check(`16px ${name}`, '上')) {
                textCom.setStyle({
                    'fontFamily': 'hanyijielongtaohuayuan'
                })
            }
            else {
                // 加载字体
                const fontface = new (window as any).FontFace(name, `url('/fonts/${name}.ttf')`);
                (document as any).fonts.add(fontface);
                fontface.load();

                fontface.loaded.then(() => {
                    console.log('load')
                    textCom.setStyle({
                        'fontFamily': 'hanyijielongtaohuayuan'
                    })
                }).catch(err => {
                    console.error(err)
                });
            }
        }
    }
}