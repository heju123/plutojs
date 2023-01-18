export default {
    "posterEdit" : {
        view : (get) => {
            return new Promise((resolve, reject)=>{
                require.ensure([], require => {
                    get(require("./view/posterEditTestView").default, resolve, reject);
                },'posterEditTestView');
            });
        }
    }
}