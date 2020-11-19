/**
 * Created by heju on 2017/7/19.
 */
import {Main} from "~/js/main";
import route from "./route.js";

class TestMain {
    constructor(){
        let mainBox = document.getElementById("mainBox");
        mainBox.style.width = window.innerWidth + "px";
        mainBox.style.height = window.innerHeight + "px";

        let main = new Main("mainBox");
        main.run(route);

        setTimeout(()=>{
            main = new Main("mainBox");
            main.run(route);
        }, 5000);
    }
}

let main = new TestMain();