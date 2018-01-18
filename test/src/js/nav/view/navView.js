import commonStyle from "@/js/common//view/style/commonStyle";
import NavController from "../controller/navController";
import linkView from "@/js/common/view/components/linkView";

const TOP_HEIGHT = 30;

export default {
    controller : NavController,
    type : "rect",
    style : {
        x : 0,
        y : 0,
        width : "100%",
        height : "100%",
        backgroundColor : "#ffffff"
    },
    children : [
        //顶部工具栏
        {
            type: "rect",
            name : "top_tool",
            style: {
                x: 0,
                y: 0,
                width: "100%",
                height: TOP_HEIGHT,
                backgroundColor: commonStyle.themeColor
            }
        },
        //内容
        {
            type : "rect",
            name : "content",
            style : {
                x : 0,
                y : TOP_HEIGHT,
                width : "100%",
                height : function(){
                    return this.parent.getHeight() - TOP_HEIGHT;
                }
            },
            children : [
                {
                    type: "scrollbar",
                    children: [
                        {
                            type : "rect",
                            name : "list",
                            style : {
                                x : 0,
                                y : 0,
                                width : "100%",
                                autoHeight : true,
                                layout: {
                                    type: "linearLayout",
                                    orientation: "vertical"
                                }
                            },
                            children : [
                                linkView("输入框", {
                                    style : {
                                        fontSize : "16px"
                                    },
                                    events : {
                                        "click" : {
                                            callback : "goLink",
                                            param : (self)=>{
                                                return ["input"];
                                            }
                                        }
                                    }
                                })
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};