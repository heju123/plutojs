import commonStyle from "@/js/common//view/style/commonStyle";
import TopController from "../../controller/topController";

export const topHeight = 40;

export let topView = ()=>{
    return {
        type: "rect",
        name : "top_tool",
        controller : TopController,
        style: {
            x: 0,
            y: 0,
            width: "100%",
            height: topHeight,
            backgroundColor: commonStyle.themeColor
        },
        children : [
            {
                type : "rect",
                style : {
                    x : 12,
                    y : function(){
                        return this.parent.getHeight() / 2 - this.getHeight() / 2;
                    },
                    width : 24,
                    height : 24,
                    lineHeight : 20,
                    fontSize : "30px",
                    fontFamily : "FontAwesome",
                    fontColor : "#ffffff",
                    textBaseline : "top",
                    autoLine : false,
                    cursor : "pointer",
                    hover : {
                        x : 9
                    }
                },
                text : "\uf100",
                animation : {
                    x : {
                        duration : "200ms",
                        easeType : "Linear",
                        easing : "ease"
                    }
                },
                events : {
                    "click" : "goHome"
                }
            }
        ]
    };
};