/**
 * Created by heju on 2017/7/27.
 */
export default {
    "cliptest" : {
        view : (get) => {
            return new Promise((resolve, reject)=>{
                require.ensure([], require => {
                    get(require("./view/cliptestView").default, resolve, reject);
                },'cliptestView');
            });
        }
    }
}