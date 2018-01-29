/**
 * Created by heju on 2017/7/27.
 */
export default {
    "nestRoute" : {
        view : (get) => {
            return new Promise((resolve, reject)=>{
                require.ensure([], require => {
                    get(require("./view/nestRouteView.js").default, resolve, reject);
                },'nestRouteView');
            });
        }
    }
}