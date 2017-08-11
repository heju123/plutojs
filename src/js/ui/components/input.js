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
        this.showTextCursorInterval = 0;
        this.multiLine = false;
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
            //绘制光标
            this.drawTextCursor(ctx);
        }
        ctx.restore();
        return true;
    }

    /** 获取文本输入光标位置 */
    getTextCursorPos(){
        let cursorIndex = globalUtil.action.inputListenerDom.selectionEnd;
        let textRow;
        if (this.text && this.text.length > 0)
        {
            for (let i = 0,j = this.text.length; i < j; i++)
            {
                if (cursorIndex <= this.text[i].length)
                {
                    textRow = i;
                    break;
                }
                cursorIndex -= this.text[i].length;
                cursorIndex--;//selectionEnd里包含多余的换行符，所以要减一个换行符
            }
            textRow = textRow === undefined ? this.text.length - 1 : textRow;
        }
        this.textCursorX = this.getTextRealX() + cursorIndex * parseInt(this.style.fontSize) + 1;
        this.textCursorY = this.getTextRealY() + this.style.lineHeight / 2 - parseInt(this.style.fontSize, 10) / 2 + this.style.lineHeight * (textRow || 0);
    }

    drawTextCursor(ctx){
        if (this.showTextCursor)
        {
            this.getTextCursorPos();
            ctx.fillStyle="#000";
            ctx.moveTo(this.textCursorX, this.textCursorY + 2);
            ctx.lineTo(this.textCursorX, this.textCursorY + this.style.lineHeight - 2);
            ctx.stroke();
        }
        this.showTextCursorInterval++;
        if (this.showTextCursorInterval === 30)
        {
            this.showTextCursorInterval = 0;
            this.showTextCursor = !this.showTextCursor;
        }
    }

    onFocus(){
        this.showTextCursorInterval = 0;
        this.showTextCursor = true;
        globalUtil.action.inputListenerDom.value = this.getText() || "";
    }

    getTextRealY(){
        let oriY = super.getTextRealY();
        if (this.multiLine)
        {
            return oriY;
        }
        else
        {
            return oriY + this.style.height / 2 - this.style.lineHeight / 2;
        }
    }
}