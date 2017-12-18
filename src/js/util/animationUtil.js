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
        let to = {};
        to[styleKey] = toVal;
        return animationUtil.executeAttrChange(com.style, to, animation);
    },
    /**
     * 执行属性改变动画
     *
     * @param to 改变的属性，用object表示
     * @param animation{duration：间隔时间（单位：秒）；easeType：动画类型（如：Linear或Elastic）；easing：动画执行方式（如：ease或easeOut）；repeat：循环执行的次数}
     */
    executeAttrChange : (com, to, animation)=>{
        return new Promise((resolve, reject)=>{
            to.ease = EasePack[animation.easeType][animation.easing];
            to.onComplete = function() {
                resolve();
            };
            if (animation.delay)
            {
                to.delay = animation.delay;
            }
            if (animation.repeat)
            {
                to.repeat = animation.repeat;
            }
            animation.duration = commonUtil.getTimeSecForSuffix(animation.duration);
            TweenMax.to(com, animation.duration, to);
        });
    }
};
export default animationUtil;