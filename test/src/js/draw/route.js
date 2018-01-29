/**
 * Created by heju on 2017/7/27.
 */
export default {
    "draw" : {
        view : (get) => {
            return new Promise((resolve, reject)=>{
                require.ensure([], require => {
                    get(require("./view/drawView").default, resolve, reject);
                },'drawView');
            });
        }
    }
}