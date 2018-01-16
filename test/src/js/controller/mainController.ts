/**
 * Created by heju on 2017/7/14.
 */
import {Controller,Component,Thread} from "../../../../src/js/main";

export default class MainController extends Controller{
    constructor(component : Component) {
        super(component);

        let thread = new Thread(this.testThread);

        thread.run({aaa : "321"}, function(key, value) {
            return value;
        }).then(function(data){
            console.log(data);
            thread.terminate();
        }).finally(()=>{
            console.log("finally");
        });
    }

    testThread(e){
        console.log(e.data);

        (<any>self).postMessage("callback");
    }

    mouseDown(e){
        console.log("main mouseDown!");
    }

    clickMain(e){
        console.log(e);
    }

    clickInput(e){
        console.log(e);
        e.stopPropagation();
    }

    mousedownInput(e){
        console.log("input mousedown");
    }

    changeRoute(e){
        let mainRoute = this.viewState.getComponentById("mainRoute");
        mainRoute.changeRoute("test");
    }

    goMovement(e){
        let mainRoute = this.viewState.getComponentById("mainRoute");
        mainRoute.changeRoute("movement", true);
    }

    getAllInput(e)
    {
        console.log(this.viewState.getComponentsByName("input"));
        e.stopPropagation();
    }

    onClickCheckbox(e)
    {
        console.log(e.target.checked);
    }
}