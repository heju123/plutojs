/**
 * Created by heju on 2017/7/27.
 */
export default {
    "particleEffects" : {
        view : (get) => {
            return new Promise((resolve, reject)=>{
                require.ensure([], require => {
                    get(require("./view/particleEffectsView").default, resolve, reject);
                },'particleEffectsView');
            });
        }
    }
}