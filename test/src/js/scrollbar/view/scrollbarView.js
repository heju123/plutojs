import commonStyle from "@/js/common//view/style/commonStyle";
import commonAnimation from "@/js/common//view/animation/commonAnimation";
import {commonUtil} from "~/js/main";
import ScrollbarController from "../controller/scrollbarController";
import {topView,topHeight} from "@/js/common/view/top/topView";

const PADDING_LEFT = 20;
const FORM_ROW_HEIGHT = 60;

export default {
    controller : ScrollbarController,
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
                    children : [
                        {
                            name : "scrollbox",
                            type : "rect",
                            style : {
                                x : 10,
                                y : 10,
                                width : 60,
                                height : 400,
                                borderWidth : 1,
                                borderColor : "#dfdfdf"
                            },
                            children : [
                                {
                                    type : "scrollbar",
                                    children : [
                                        {
                                            id: "scrollbar1",
                                            type: "rect",
                                            style : {
                                                x : 0,
                                                y : 0,
                                                width : "100%",
                                                autoHeight : true,
                                                layout: {
                                                    type: "linearLayout",
                                                    orientation: "vertical"
                                                }
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            name : "scrollbox",
                            type : "rect",
                            style : {
                                x : 10,
                                y : 450,
                                width : 400,
                                height : 120,
                                borderWidth : 1,
                                borderColor : "#dfdfdf"
                            },
                            children : [
                                {
                                    type : "scrollbar",
                                    children : [
                                        {
                                            id: "scrollbar2",
                                            type: "rect",
                                            style : {
                                                x : 0,
                                                y : 0,
                                                autoWidth : true,
                                                height : "100%",
                                                layout: {
                                                    type: "linearLayout",
                                                    orientation: "horizontal",
                                                    contentAlign: "center"
                                                }
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            name : "scrollbox",
                            type : "rect",
                            style : {
                                x : 120,
                                y : 10,
                                width : 120,
                                height : 400,
                                borderWidth : 1,
                                borderColor : "#dfdfdf"
                            },
                            children : [
                                {
                                    type : "scrollbar",
                                    children : [
                                        {
                                            id: "scrollbar3",
                                            type: "rect",
                                            style : {
                                                x : 0,
                                                y : 0,
                                                width : "100%",
                                                autoHeight : true,
                                                backgroundColor : "#c0c0c0",
                                                layout: {
                                                    type: "linearLayout",
                                                    orientation: "vertical",
                                                    contentAlign: "center"
                                                }
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            type : "button",
                            style : Object.assign({}, commonStyle.buttonStyle, {
                                x : 260,
                                y : 10,
                                autoWidth : true,
                                height : 30
                            }),
                            animation : commonAnimation.buttonAnimation,
                            text : "添加子节点",
                            events : {
                                "click" : {
                                    callback : "asyncAppendChild",
                                    param : (self)=>{
                                        return "scrollbar3";
                                    }
                                }
                            }
                        },
                        {
                            type : "button",
                            style : Object.assign({}, commonStyle.buttonStyle, {
                                x : 260,
                                y : 50,
                                autoWidth : true,
                                height : 30
                            }),
                            animation : commonAnimation.buttonAnimation,
                            text : "移除子节点",
                            events : {
                                "click" : {
                                    callback : "asyncRemoveChild",
                                    param : (self)=>{
                                        return "scrollbar3";
                                    }
                                }
                            }
                        },
                        {
                            type : "button",
                            style : Object.assign({}, commonStyle.buttonStyle, {
                                x : 260,
                                y : 90,
                                autoWidth : true,
                                height : 30
                            }),
                            animation : commonAnimation.buttonAnimation,
                            text : "移除全部",
                            events : {
                                "click" : {
                                    callback : "asyncRemoveAllChildren",
                                    param : (self)=>{
                                        return "scrollbar3";
                                    }
                                }
                            }
                        },
                        {
                            name : "scrollbox",
                            type : "rect",
                            style : {
                                x : 420,
                                y : 10,
                                width : 400,
                                height : 400,
                                borderWidth : 1,
                                borderColor : "#dfdfdf"
                            },
                            children : [
                                {
                                    type : "scrollbar",
                                    children : [
                                        {
                                            id: "scrollbar4",
                                            type: "rect",
                                            style : {
                                                x : 0,
                                                y : 0,
                                                width : "100%",
                                                autoHeight : true,
                                                backgroundColor : "#c0c0c0",
                                                layout: {
                                                    type: "linearLayout",
                                                    orientation: "horizontal",
                                                    autoLine: true
                                                }
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            type : "button",
                            style : Object.assign({}, commonStyle.buttonStyle, {
                                x : 840,
                                y : 10,
                                autoWidth : true,
                                height : 30
                            }),
                            animation : commonAnimation.buttonAnimation,
                            text : "添加子节点",
                            events : {
                                "click" : {
                                    callback : "asyncAppendChild",
                                    param : (self)=>{
                                        return "scrollbar4";
                                    }
                                }
                            }
                        },
                        {
                            type : "button",
                            style : Object.assign({}, commonStyle.buttonStyle, {
                                x : 840,
                                y : 50,
                                autoWidth : true,
                                height : 30
                            }),
                            animation : commonAnimation.buttonAnimation,
                            text : "移除子节点",
                            events : {
                                "click" : {
                                    callback : "asyncRemoveChild",
                                    param : (self)=>{
                                        return "scrollbar4";
                                    }
                                }
                            }
                        },
                        {
                            type : "button",
                            style : Object.assign({}, commonStyle.buttonStyle, {
                                x : 840,
                                y : 90,
                                autoWidth : true,
                                height : 30
                            }),
                            animation : commonAnimation.buttonAnimation,
                            text : "移除全部",
                            events : {
                                "click" : {
                                    callback : "asyncRemoveAllChildren",
                                    param : (self)=>{
                                        return "scrollbar4";
                                    }
                                }
                            }
                        }
                    ]
                }
            ]
        }
    ]
};