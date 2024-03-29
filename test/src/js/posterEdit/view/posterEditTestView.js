import commonStyle from "@/js/common//view/style/commonStyle";
import commonAnimation from "@/js/common//view/animation/commonAnimation";
import PosterEditTestController from "../controller/posterEditTestController";
import {topView,topHeight} from "@/js/common/view/top/topView";

const TOOLHEIGHT = 40;

export default {
    controller : PosterEditTestController,
    type : "rect",
    style : {
        x : 0,
        y : 0,
        width : "100%",
        height : "100%",
        backgroundColor : "#ffffff",
        layout : {
            type : "linearLayout",
            orientation : "vertical"
        }
    },
    children : [
        //顶部工具栏
        topView(),
        {
            type : "rect",
            name : "content",
            style : {
                width : "100%",
                height : TOOLHEIGHT,
                layout : {
                    type : "linearLayout",
                    orientation : "horizontal",
                    contentAlign : "center"
                }
            },
            children : [
                {
                    type : "button",
                    style : Object.assign({}, commonStyle.buttonStyle, {
                        autoWidth : true,
                        height : 30
                    }),
                    animation : commonAnimation.buttonAnimation,
                    text : "新增海报",
                    events : {
                        "click" : "addPoster"
                    }
                },
                {
                    type : "button",
                    style : Object.assign({}, commonStyle.buttonStyle, {
                        autoWidth : true,
                        height : 30
                    }),
                    animation : commonAnimation.buttonAnimation,
                    text : "新增文本",
                    events : {
                        "click" : "addText"
                    }
                },
                {
                    type : "button",
                    style : Object.assign({}, commonStyle.buttonStyle, {
                        autoWidth : true,
                        height : 30
                    }),
                    animation : commonAnimation.buttonAnimation,
                    text : "改变选中文本字体",
                    events : {
                        "click" : "changeFontFamily"
                    }
                },
                {
                    type : "button",
                    style : Object.assign({}, commonStyle.buttonStyle, {
                        autoWidth : true,
                        height : 30
                    }),
                    animation : commonAnimation.buttonAnimation,
                    text : "导出图片",
                    events : {
                        "click" : "exportImage"
                    }
                }
            ]
        },
        {
            type : "rect",
            name : "editContent",
            style : {
                width : "100%",
                height : function(){
                    return this.parent.getHeight() - topHeight - TOOLHEIGHT;
                },
                backgroundColor: '#f1f3f7'
            }
        }
    ]
};