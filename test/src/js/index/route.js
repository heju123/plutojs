/**
 * Created by heju on 2017/7/27.
 */
export default {
    "main" : {
        view : (get) => {
            return new Promise((resolve, reject)=>{
                require.ensure([], require => {
                    get(require("./view/mainView.js").default, resolve, reject);
                },'mainView');
            });
        }
    },
    "movement" : {
        view : (get) => {
            return new Promise((resolve, reject)=>{
                require.ensure([], require => {
                    get(require("./view/movement/movementView.js").default, resolve, reject);
                },'movementView');
            });
        }
    },
    "test" : {
        view : (get) => {
            return new Promise((resolve, reject)=>{
                require.ensure([], require => {
                    get(require("./view/test1View.js").default, resolve, reject);
                },'test1View');
            });
        }
    }
}