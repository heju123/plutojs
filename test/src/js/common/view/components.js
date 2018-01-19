import commonStyle from "@/js/common//view/style/commonStyle";
import {commonUtil} from "~/js/main";

//超链接
export let getLinkView = (text, opts) => {
    const output = {
        type : "rect",
        style : {
            x : 10,
            height : 40,
            lineHeight : 40,
            autoWidth : true,
            cursor : "pointer",
            hover : function(){
                this.setStyle("fontColor" , commonStyle.themeColor);
            },
            hoverout : function(){
                this.setStyle("fontColor" , commonStyle.fontColor);
            }
        },
        animation : {
            "fontColor" : {
                duration : "300ms",
                easeType : "Linear",
                easing : "ease"
            }
        },
        text : text
    };

    if (opts && opts.style)
    {
        commonUtil.copyObject(opts.style, output.style, true);
    }

    if (opts && opts.events)
    {
        output.events = opts.events;
    }

    return output;
};