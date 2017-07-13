/**
 * Created by heju on 2017/7/10.
 */
import Fps from "./ui/fps.js";

class Main {
    constructor(eleId){
        let mainBody = document.getElementById(eleId);
        this.fps = new Fps(mainBody);
    }

    run(rootPanel){
        this.fps.startLoop();
    }
}

window.Monk = Main;