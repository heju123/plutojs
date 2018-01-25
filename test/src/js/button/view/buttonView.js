import commonStyle from "@/js/common//view/style/commonStyle";
import commonAnimation from "@/js/common//view/animation/commonAnimation";
import {commonUtil} from "~/js/main";
import ButtonController from "../controller/buttonController";
import {topView,topHeight} from "@/js/common/view/top/topView";

const PADDING_LEFT = 20;
const FORM_ROW_HEIGHT = 60;

export default {
    controller : ButtonController,
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
        topView(),
        //内容
        {
            type : "rect",
            name : "content",
            style : {
                x : 0,
                y : topHeight,
                width : "100%",
                height : function(){
                    return this.parent.getHeight() - topHeight;
                }
            },
            children : [
                {
                    type: "scrollbar",
                    children: [
                        {
                            type : "rect",
                            name : "form",
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
                                {
                                    type : "rect",
                                    name : "row",
                                    style : {
                                        x : 0,
                                        width : "100%",
                                        height : FORM_ROW_HEIGHT
                                    },
                                    children : [
                                        {
                                            type : "button",
                                            style : Object.assign({}, commonStyle.buttonStyle, {
                                                x : PADDING_LEFT,
                                                y : function(){
                                                    return this.parent.getHeight() / 2 - this.getHeight() / 2;
                                                },
                                                autoWidth : true,
                                                height : 30
                                            }),
                                            animation : commonAnimation.buttonAnimation,
                                            text : "按钮1",
                                            events : {
                                                "click" : "testClick"
                                            }
                                        }
                                    ]
                                },
                                {
                                    type : "rect",
                                    name : "row",
                                    style : {
                                        x : 0,
                                        width : "100%",
                                        height : FORM_ROW_HEIGHT
                                    },
                                    children : [
                                        {
                                            type : "button",
                                            style : Object.assign({}, commonStyle.buttonStyle, {
                                                x : PADDING_LEFT,
                                                y : function(){
                                                    return this.parent.getHeight() / 2 - this.getHeight() / 2;
                                                },
                                                autoWidth : true,
                                                height : 30,
                                                disabled : true
                                            }, commonStyle.disabledButtonStyle),
                                            animation : commonAnimation.buttonAnimation,
                                            text : "按钮disabled",
                                            events : {
                                                "click" : "testClick"
                                            }
                                        }
                                    ]
                                },
                                {
                                    type : "rect",
                                    name : "row",
                                    style : {
                                        x : 0,
                                        width : "100%",
                                        height : FORM_ROW_HEIGHT
                                    },
                                    children : [
                                        {
                                            type : "button",
                                            style : Object.assign({}, commonStyle.buttonStyle, {
                                                x : PADDING_LEFT,
                                                y : function(){
                                                    return this.parent.getHeight() / 2 - this.getHeight() / 2;
                                                },
                                                width : 32,
                                                height : 32,
                                                backgroundImage : "/images/button.png",
                                                backgroundColor : undefined,
                                                hover : function(){
                                                    this.setStyle("backgroundImage" , "/images/button_on.png");
                                                },
                                                hoverout : function(){
                                                    this.setStyle("backgroundImage" , "/images/button.png");
                                                },
                                                active : function(){
                                                    this.setStyle("backgroundImage" , "/images/button_active.png");
                                                },
                                                activeout : function(){
                                                    if (this.viewState.getHoverComponent() === this)
                                                    {
                                                        this.setStyle("backgroundImage" , "/images/button_on.png");
                                                    }
                                                    else
                                                    {
                                                        this.setStyle("backgroundImage" , "/images/button.png");
                                                    }
                                                }
                                            }),
                                            animation : commonAnimation.buttonAnimation,
                                            events : {
                                                "click" : "testClick"
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};