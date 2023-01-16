export default {
    "posterEdit" : {
        view : (get) => {
            return new Promise((resolve, reject)=>{
                require.ensure([], require => {
                    get(require("./view/posterEditView").default, resolve, reject);
                },'posterEditView');
            });
        }
    }
}