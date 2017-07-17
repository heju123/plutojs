/**
 * Created by heju on 2017/7/10.
 */
import Fps from "./ui/fps.js";
import httpUtil from "./util/httpUtil.js";

class Main {
    constructor(eleId){
        let mainBody = document.getElementById(eleId);
        this.fps = new Fps(mainBody);
    }

    run(rootPanel){
        httpUtil.get("/monk-config.json").then((res)=>{
            this.fps.startLoop();
        });
    }
}

window.Monk = Main;