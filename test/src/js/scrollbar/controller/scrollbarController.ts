import {Controller,Component,Rect} from "~/js/main";

export default class ScrollbarController extends Controller{
    constructor(component : Component) {
        super(component);

        this.registerEvent("$onViewLoaded", ()=>{
            let scrollbar1 = this.component.getComponentById("scrollbar1");
            this.produceChildRect(scrollbar1, 100);

            let scrollbar2 = this.component.getComponentById("scrollbar2");
            this.produceChildRect(scrollbar2, 100);

            let scrollbar3 = this.component.getComponentById("scrollbar3");
            this.produceChildRect(scrollbar3, 5);

            let scrollbar4 = this.component.getComponentById("scrollbar4");
            this.produceChildRect(scrollbar4, 100);
        });
    }

    produceChildRect(parent, count){
        let rect : Rect;
        for (let i = 0; i < count; i++)
        {
            rect = new Rect(parent);
            rect.initCfg({
                type : "rect",
                style : {
                    width : 60,
                    height : 60,
                    backgroundColor : "#" + Math.floor(Math.random() * 0xffffff).toString(16)
                }
            });
            parent.appendChild(rect);
        }
    }

    asyncAppendChild(name : string){
        let scrollbar3 = this.component.getComponentById(name);
        this.produceChildRect(scrollbar3, 1);
    }

    asyncRemoveChild(name : string){
        let scrollbar3 = this.component.getComponentById(name);
        scrollbar3.removeChild(scrollbar3.children.length - 1);
    }

    asyncRemoveAllChildren(name : string){
        let scrollbar3 = this.component.getComponentById(name);
        scrollbar3.removeAllChildren();
    }
}