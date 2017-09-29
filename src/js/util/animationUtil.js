import commonUtil from "./commonUtil.js";
import TweenMax from "../../libs/TweenLite/TweenMax.min.js";
import EasePack from "../../libs/TweenLite/easing/EasePack.min.js";
import ColorPropsPlugin from "../../libs/TweenLite/plugins/ColorPropsPlugin.min.js";

let animationUtil = {
    /**
     * 执行样式改变动画
     *
     * @param styleKey 样式key
     * @param toVal 修改后的值
     * @param animation{duration：间隔时间（单位：秒）；easeType：动画类型（如：Linear或Elastic）；easing：动画执行方式（如：ease或easeOut）；repeat：循环执行的次数}
     */
    executeStyleChange : (com, styleKey, toVal, animation)=>{
        return new Promise((resolve, reject)=>{
            let to = {};
            to[styleKey] = toVal;
            to.ease = EasePack[animation.easeType][animation.easing];
            to.onComplete = function() {
                resolve();
            };
            if (animation.repeat)
            {
                to.repeat = animation.repeat;
            }
            animation.duration = commonUtil.getTimeSecForSuffix(animation.duration);
            TweenMax.to(com.style, animation.duration, to);
        });
    }
};
export default animationUtil;