/**
 * Created by heju on 2017/7/27.
 */
import mainView from "./view/mainView.js";

export default {
    "main" : {
        view : mainView,
        default : true
    },
    "main.movement" : {
        view : (get) => {
            return new Promise((resolve, reject)=>{
                require.ensure([], require => {
                    get(require("./view/movement/movementView.js").default, resolve, reject);
                },'movementView');
            });
        }
    },
    "main.test" : {
        view : (get) => {
            return new Promise((resolve, reject)=>{
                require.ensure([], require => {
                    get(require("./view/test1View.js").default, resolve, reject);
                },'test1View');
            });
        }
    }
}