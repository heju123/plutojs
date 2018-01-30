/**
 * Created by heju on 2017/7/27.
 */
export default {
    "scrollbar" : {
        view : (get) => {
            return new Promise((resolve, reject)=>{
                require.ensure([], require => {
                    get(require("./view/scrollbarView").default, resolve, reject);
                },'scrollbarView');
            });
        }
    }
}