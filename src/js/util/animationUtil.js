import commonUtil from "./commonUtil.js";
import TweenLite from "../../libs/TweenLite/TweenLite.min.js";
import EasePack from "../../libs/TweenLite/easing/EasePack.min.js";

let animationUtil = {
    /**
     * 执行样式改变动画
     *
     * @param styleKey 样式key
     * @param toVal 修改后的值
     * @param animation
     */
    executeStyleChange : (com, styleKey, toVal, animation)=>{
        let to = {};
        to[styleKey] = toVal;
        to.ease = EasePack[animation.easeType][animation.easing];
        to.onComplete = function() {
        };
        animation.duration = commonUtil.getTimeSecForSuffix(animation.duration)
        TweenLite.to(com.style, animation.duration, to);//duration(单位：秒)
    }
};
export default animationUtil;