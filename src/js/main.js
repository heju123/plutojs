/**
 * Created by heju on 2017/7/10.
 */
import Fps from "./ui/fps.js";
import httpUtil from "./util/httpUtil.js";
import commonUtil from "./util/commonUtil.js";

class Main {
    constructor(eleId){
        let mainBody = document.getElementById(eleId);
        this.fps = new Fps(mainBody);
    }

    setMainView(mainView){
        this.fps.setMainView(mainView);
        this.fps.startLoop();
    }

    run(mainView){
        this.setMainView(mainView);
    }
}

window.Monk = Main;