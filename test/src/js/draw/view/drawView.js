import commonStyle from "@/js/common//view/style/commonStyle";
import {commonUtil} from "~/js/main";
import DrawController from "../controller/drawController";
import {topView,topHeight} from "@/js/common/view/top/topView";
import QuadraticCurveController from "../controller/quadraticCurveController";

const PADDING_LEFT = 20;
const FORM_ROW_HEIGHT = 60;

export default {
    controller : DrawController,
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
                    id : "scrollbar",
                    type: "scrollbar",
                    children: [
                        {
                            id : "rect1",
                            type : "rect",
                            style : {
                                x : 10,
                                y : 10,
                                width : 20,
                                height : 20,
                                backgroundColor : "#ff8532"
                            }
                        },
                        {
                            id : "rect2",
                            type : "rect",
                            style : {
                                x : 100,
                                y : 100,
                                width : 20,
                                height : 20,
                                backgroundColor : "#ff8532"
                            }
                        },
                        {
                            id : "rect3",
                            type : "rect",
                            style : {
                                x : 280,
                                y : 10,
                                width : 20,
                                height : 20,
                                backgroundColor : "#FF606A"
                            }
                        },
                        {
                            id : "rect4",
                            type : "rect",
                            style : {
                                x : 200,
                                y : 100,
                                width : 20,
                                height : 20,
                                backgroundColor : "#FF606A"
                            }
                        },
                        {
                            id : "rect5",
                            type : "rect",
                            style : {
                                x : 10,
                                y : 210,
                                width : 20,
                                height : 20,
                                backgroundColor : "#94b8ff"
                            }
                        },
                        {
                            id : "rect6",
                            type : "rect",
                            style : {
                                x : 80,
                                y : 310,
                                width : 20,
                                height : 20,
                                backgroundColor : "#94b8ff"
                            }
                        },
                        {
                            id : "rect7",
                            type : "rect",
                            style : {
                                x : 280,
                                y : 200,
                                width : 20,
                                height : 20,
                                backgroundColor : "#4ffcff"
                            }
                        },
                        {
                            id : "rect8",
                            type : "rect",
                            style : {
                                x : 200,
                                y : 310,
                                width : 20,
                                height : 20,
                                backgroundColor : "#4ffcff"
                            }
                        },
                        {
                            id : "rect9",
                            type : "rect",
                            style : {
                                x : 10,
                                y : 480,
                                width : 20,
                                height : 20,
                                backgroundColor : "#c380ff"
                            }
                        },
                        {
                            id : "rect10",
                            type : "rect",
                            style : {
                                x : 180,
                                y : 480,
                                width : 20,
                                height : 20,
                                backgroundColor : "#c380ff"
                            }
                        },
                        {
                            id : "rect13",
                            type : "rect",
                            style : {
                                x : 480,
                                y : 10,
                                width : 20,
                                height : 20,
                                backgroundColor : "#4bffee"
                            }
                        },
                        {
                            id : "rect14",
                            type : "rect",
                            style : {
                                x : 480,
                                y : 200,
                                width : 20,
                                height : 20,
                                backgroundColor : "#4bffee"
                            }
                        },
                        {
                            name : "quadraticCurve",
                            type : "rect",
                            controller : QuadraticCurveController,
                            style : {
                                x : 650,
                                y : 10,
                                width : 400,
                                height : 300,
                                borderWidth : 1,
                                borderColor : "#a0a0a0"
                            },
                            events : {
                                "mousedown" : "onMousedown",
                                "mousemove" : "onMousemove",
                                "mouseup" : "onMouseup"
                            }
                        }
                    ]
                }
            ]
        }
    ]
};