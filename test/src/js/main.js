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

        main.getViewState().registerEvent('onClickGoMovement', ()=>{
            console.log('go movement')
        })
    }
}

let main = new TestMain();