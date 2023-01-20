/**
 * Created by heju on 2017/7/30.
 */
import Scrollbar from "./scrollbar";
import globalUtil from "../../util/globalUtil";
import commonUtil from "../../util/commonUtil";
import Component from "./component";
import ViewState from "../viewState";

export default class Input extends Scrollbar {
    private showTextCursor : boolean;
    private showTextCursorInterval : number;
    private textCursorX : number;
    private textCursorY : number;

    constructor(parent? : Component | ViewState) {
        super(parent);

        this.showTextCursor = true;
        this.showTextCursorInterval = 0;

        this.setStyle({
            multiLine : false,
            scrollText : true
        });
    }

    initCfg(cfg : any) : Promise<any>{
        let promise = super.initCfg(cfg);
        return promise;
    }

    draw(ctx : CanvasRenderingContext2D) : boolean {
        if (!super.draw(ctx)) {
            return false;
        }

        ctx.save();
        this.setCommonStyle(ctx);
        this.setClip(ctx);
        ctx.beginPath();
        ctx.font = this.style.fontSize + " " + this.style.fontFamily;
        ctx.fillStyle = this.style.fontColor;
        ctx.textBaseline = this.style.textBaseline || "top";
        let metrics = ctx.measureText('测');
        let fontHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent; 
        this.lineHeight = this.style.lineHeight || fontHeight;
        //focus
        if (globalUtil.action.focusComponent === this && !this.style.readOnly) {
            //绘制光标
            this.drawTextCursor(ctx);
        }
        ctx.closePath();
        ctx.restore();
        return true;
    }

    /** 获取文本输入光标位置 */
    private getTextCursorPos(){
        let selectionEnd = globalUtil.action.inputListenerDom.selectionEnd;
        let textRow;
        if (this.text && this.text.length > 0)
        {
            for (let i = 0,j = this.text.length; i < j; i++)
            {
                if (selectionEnd <= this.text[i].length)
                {
                    textRow = i;
                    break;
                }
                selectionEnd -= this.text[i].length;
                selectionEnd--;//selectionEnd里包含多余的换行符，所以要减一个换行符
            }
            textRow = textRow === undefined ? this.text.length - 1 : textRow;
        }
        this.textCursorX = selectionEnd * parseInt(this.style.fontSize) + 1;
        this.textCursorY = this.lineHeight / 2 - parseInt(this.style.fontSize, 10) / 2 + this.lineHeight * (textRow || 0);
    }

    private drawTextCursor(ctx : CanvasRenderingContext2D){
        if (this.showTextCursor)
        {
            if (!globalUtil.action.inputListenerDom.compositionMode)
            {
                this.getTextCursorPos();
            }
            ctx.fillStyle="#000";
            ctx.moveTo(this.getTextRealX() + this.textCursorX, this.getTextRealY() + this.textCursorY);
            ctx.lineTo(this.getTextRealX() + this.textCursorX, this.getTextRealY() + this.textCursorY + parseInt(this.style.fontSize, 10));
            ctx.stroke();
        }
        this.showTextCursorInterval++;
        if (this.showTextCursorInterval === 30)
        {
            this.showTextCursorInterval = 0;
            this.showTextCursor = !this.showTextCursor;
        }
    }

    onFocus(mx : number, my : number){
        super.onFocus(mx, my);

        this.showTextCursorInterval = 0;
        this.showTextCursor = true;
        globalUtil.action.inputListenerDom.value = this.getText() || "";

        if (this.text)//点击输入框更改光标位置
        {
            let textX;
            let textY;
            let charCount = 0;
            let char;
            let cindex;
            this.text.forEach((row, index)=>{
                char = undefined;
                cindex = 0;
                while (char = row.charAt(cindex))
                {
                    textX = this.getTextRealX() + cindex * parseInt(this.style.fontSize, 10);
                    textY = this.getTextRealY() + this.lineHeight / 2 - parseInt(this.style.fontSize, 10) / 2 + this.lineHeight * index;
                    if (my >= textY
                        && my <= textY + parseInt(this.style.fontSize, 10)
                        && mx >= textX
                        && mx <= textX + parseInt(this.style.fontSize, 10))
                    {
                        globalUtil.action.inputListenerDom.setSelectionRange(charCount + 1, charCount + 1);
                    }
                    charCount++;
                    cindex++;
                }
                charCount++;//加上换行符
            });
        }
    }

    protected getTextRealX() : number{
        return super.getTextRealX();
    }

    protected getTextRealY() : number{
        let oriY = super.getTextRealY();
        if (this.style.multiLine)
        {
            return oriY;
        }
        else
        {
            return oriY + this.getHeight() / 2 - this.lineHeight / 2;
        }
    }

    setText(text : string){
        super.setText(text);
        this.doLayout();
    }
}