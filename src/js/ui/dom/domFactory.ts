import DomImage from "./domImage";
import Component from "../components/component";
import globalUtil from "../../util/globalUtil";

export default class DomFactory{
    createDom(arg1? : Component, arg2? : string, arg3? : any){
        if (arguments.length === 3 && typeof(arguments[0]) === "object" && typeof(arguments[1]) === "string" && typeof(arguments[2]) === "object")
        {
            this._createDom(arguments[0], arguments[1], arguments[2]);
        }
    }

    _createDom(parent : Component, className : string, cfg : any){
        let dom;
        switch (className)
        {
            case "DomImage" :
                dom = new DomImage(parent, cfg);
                break;
        }
        globalUtil.showArea.appendChild(dom.dom);
    }
}