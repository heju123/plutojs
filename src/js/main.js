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

        globalUtil.inputDom = document.createElement("TEXTAREA");
        globalUtil.inputDom.style.position = "fixed";
        globalUtil.inputDom.style.left = "0px";
        globalUtil.inputDom.style.top = "0px";
        globalUtil.inputDom.style["z-index"] = -1;
        document.body.appendChild(globalUtil.inputDom);
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