import TweenLite from "../../libs/TweenLite/TweenLite.min.js";

let animationUtil = {
    /**
     * 执行样式改变动画
     *
     * @param styleKey 样式key
     * @param toVal 修改后的值
     * @param duration 时间间隔(单位：秒)
     */
    executeStyleChange : (com, styleKey, toVal, duration)=>{
        TweenLite.to(com.style, duration, {backgroundColor:toVal, ease:Linear.ease,
            onComplete: function() {
            }});
    }
};
export default animationUtil;