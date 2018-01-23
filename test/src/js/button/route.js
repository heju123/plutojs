/**
 * Created by heju on 2017/7/27.
 */
export default {
    "button" : {
        view : (get) => {
            return new Promise((resolve, reject)=>{
                require.ensure([], require => {
                    get(require("./view/buttonView").default, resolve, reject);
                },'buttonView');
            });
        }
    }
}