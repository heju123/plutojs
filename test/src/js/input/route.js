/**
 * Created by heju on 2017/7/27.
 */
export default {
    "input" : {
        view : (get) => {
            return new Promise((resolve, reject)=>{
                require.ensure([], require => {
                    get(require("./view/inputView").default, resolve, reject);
                },'inputView');
            });
        }
    }
}