/**
 * Created by heju on 2017/7/10.
 */
import Fps from "./ui/fps.js";
import httpUtil from "./util/httpUtil.js";
import commonUtil from "./util/commonUtil.js";
import globalUtil from "./util/globalUtil.js";
import Controller from "./ui/controller.js";

class Main {
    constructor(eleId){
        let mainBody = document.getElementById(eleId);
        this.fps = new Fps(mainBody);

        globalUtil.action = {};

        //输入框输入监听
        globalUtil.action.inputListenerDom = document.createElement("TEXTAREA");
        globalUtil.action.inputListenerDom.style.position = "fixed";
        globalUtil.action.inputListenerDom.style.left = "0px";
        globalUtil.action.inputListenerDom.style.top = "0px";
        globalUtil.action.inputListenerDom.style["z-index"] = -1;
        globalUtil.eventBus.addEventListener(globalUtil.action.inputListenerDom, "compositionstart", (e)=>{
            console.log(globalUtil.action.inputListenerDom.value);
        });
        globalUtil.eventBus.addEventListener(globalUtil.action.inputListenerDom, "compositionend", (e)=>{
            console.log(globalUtil.action.inputListenerDom.value);
        });
        globalUtil.eventBus.addEventListener(globalUtil.action.inputListenerDom, "input", (e)=>{
            console.log(globalUtil.action.inputListenerDom.value);
        });
        document.body.appendChild(globalUtil.action.inputListenerDom);
    }

    setMainView(viewCfg){
        this.fps.setMainView(viewCfg);
        this.fps.startLoop();
    }

    run(viewCfg){
        this.setMainView(viewCfg);
    }
}

window.Monk = {
    Main : Main,
    commonUtil : commonUtil,
    httpUtil : httpUtil,
    Controller : Controller
};