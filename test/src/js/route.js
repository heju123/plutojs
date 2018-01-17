/**
 * Created by heju on 2017/7/27.
 */
import mainView from "./mainView.js";

export default {
    id : "mainRoute",
    type : "route",
    routes : {
        "main" : {
            view : mainView,
            default : true
        },
        "movement" : {
            view : (get) => {
                return new Promise((resolve, reject)=>{
                    require.ensure([], require => {
                        get(require("./movement/movementView.js").default, resolve, reject);
                    },'movementView');
                });
            }
        },
        "test" : {
            view : (get) => {
                return new Promise((resolve, reject)=>{
                    require.ensure([], require => {
                        get(require("./test1View.js").default, resolve, reject);
                    },'test1View');
                });
            }
        }
    }
}