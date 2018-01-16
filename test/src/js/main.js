/**
 * Created by heju on 2017/7/19.
 */
import {Main} from "~/js/main";
import route from "./view/route.js";

class TestMain {
    constructor(){
        let mainBox = document.getElementById("mainBox");
        mainBox.style.width = window.innerWidth + "px";
        mainBox.style.height = window.innerHeight + "px";

        let main = new Main("mainBox");

        main.run(route);
    }
}

let main = new TestMain();