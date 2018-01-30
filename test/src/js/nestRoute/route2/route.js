/**
 * Created by heju on 2017/7/27.
 */
export default {
    "nestRoute.route2" : {
        view : (get) => {
            return new Promise((resolve, reject)=>{
                require.ensure([], require => {
                    get(require("./view/route2View").default, resolve, reject);
                },'nestRoute.route2View');
            });
        }
    }
}