/**
 * Created by heju on 2017/7/27.
 */
export default {
    "checkbox" : {
        view : (get) => {
            return new Promise((resolve, reject)=>{
                require.ensure([], require => {
                    get(require("./view/checkboxView").default, resolve, reject);
                },'checkboxView');
            });
        }
    }
}