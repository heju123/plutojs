/**
 * Created by heju on 2017/7/30.
 */
import Rect from "./rect.js";
import globalUtil from "../../util/globalUtil";
import commonUtil from "../../util/commonUtil";

export default class Input extends Rect {
    constructor(parent) {
        super(parent);

        this.showTextCursor = true;
        this.showTextCursorInterval = setInterval(()=>{
            this.showTextCursor = !this.showTextCursor;
        }, 500);
    }

    initCfg(cfg){
        super.initCfg(cfg);
    }

    draw(ctx) {
        if (!super.draw(ctx)) {
            return false;
        }

        ctx.save();
        this.setClip(ctx);
        ctx.beginPath();
        //focus
        if (globalUtil.action.focusComponent === this) {
            this.text = this.getTextForRows(globalUtil.action.inputListenerDom.value);
            //绘制光标
            this.drawTextCursor(ctx);
        }
        ctx.restore();
        return true;
    }

    /** 获取文本输入光标位置 */
    getTextCursor(){
        return globalUtil.action.inputListenerDom.selectionEnd;
    }

    /** 获取文本输入光标位置 */
    getTextCursorPos(){
        if (!this.text || this.text.length === 0)
        {
            return;
        }
        let cursorIndex = globalUtil.action.inputListenerDom.selectionEnd;
        let charNum = 0;
        let textIndex = 0;
        for (let j = this.text.length; textIndex < j; textIndex++)
        {
            charNum += this.text[textIndex].length;
            if (cursorIndex <= charNum)
            {
                break;
            }
        }
        this.textCursorX = this.getRealX(this) + cursorIndex * parseInt(this.style.fontSize) + 1;
        this.textCursorY = this.getRealY(this) + this.style.lineHeight / 2 - parseInt(this.style.fontSize, 10) / 2 + this.style.lineHeight * textIndex;
        console.log(Math.max(charNum,cursorIndex));
        console.log(Math.min(charNum,cursorIndex));
    }

    drawTextCursor(ctx){
        if (this.showTextCursor)
        {
            let textWidth;
            if (this.text && this.text.length > 0)
            {
                textWidth = ctx.measureText(this.text[0]).width
            }
            else
            {
                textWidth = 0;
            }
            let textCursor = this.getTextCursor();
            let xOffset = textWidth + 1;
            ctx.fillStyle="#000";
            ctx.moveTo(this.getRealX(this) + xOffset, this.getRealY(this) + 2);
            ctx.lineTo(this.getRealX(this) + xOffset, this.getRealY(this) + this.style.lineHeight - 2);
            ctx.stroke();
        }
    }
}