import commonStyle from "@/js/common//view/style/commonStyle";
import commonAnimation from "@/js/common//view/animation/commonAnimation";
import {commonUtil} from "~/js/main";
import CliptestController from "../controller/cliptestController";
import {topView,topHeight} from "@/js/common/view/top/topView";

const PADDING_LEFT = 20;
const FORM_ROW_HEIGHT = 60;

export default {
    controller : CliptestController,
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
                    type: "rect",
                    style: {
                        x: 10,
                        y: 10,
                        width: 400,
                        height: 400,
                        borderWidth: 1,
                        borderColor: "#c5c5c5"
                    },
                    children : [
                        {
                            id : "drag1",
                            type: "rect",
                            style: {
                                x: 0,
                                y: 0,
                                width: 400,
                                height: 400,
                                backgroundColor : "#fff81d",
                                draggable : true,
                                scale : "1,1"
                            }
                        }
                    ]
                },
                {
                    type : "button",
                    style : Object.assign({}, commonStyle.buttonStyle, {
                        x : 440,
                        y : 10,
                        autoWidth : true,
                        height : 30
                    }),
                    animation : commonAnimation.buttonAnimation,
                    text : "放大",
                    events : {
                        "click" : {
                            callback : "zoomIn",
                            param : (self)=>{
                                return "drag1";
                            }
                        }
                    }
                },
                {
                    type : "button",
                    style : Object.assign({}, commonStyle.buttonStyle, {
                        x : 440,
                        y : 50,
                        autoWidth : true,
                        height : 30
                    }),
                    animation : commonAnimation.buttonAnimation,
                    text : "缩小",
                    events : {
                        "click" : {
                            callback : "zoomOut",
                            param : (self)=>{
                                return "drag1";
                            }
                        }
                    }
                },
                {
                    type: "rect",
                    style: {
                        x: 510,
                        y: 10,
                        width: 400,
                        height: 400,
                        borderWidth: 1,
                        borderColor: "#c5c5c5"
                    },
                    hasClip : false,
                    children : [
                        {
                            id : "drag2",
                            type: "rect",
                            style: {
                                x: 0,
                                y: 0,
                                width: 400,
                                height: 400,
                                backgroundColor : "#cecece",
                                draggable : true,
                                scale : "1,1"
                            },
                            children : [
                                {
                                    type : "rect",
                                    style : {
                                        x : 10,
                                        y : 10,
                                        width : 80,
                                        height : 80,
                                        backgroundColor : "#ff0000"
                                    }
                                },
                                {
                                    type : "rect",
                                    style : {
                                        x : 300,
                                        y : 300,
                                        width : 80,
                                        height : 80,
                                        backgroundColor : "#ff941c"
                                    }
                                },
                                {
                                    type : "rect",
                                    style : {
                                        x : 10,
                                        y : 300,
                                        width : 80,
                                        height : 80,
                                        backgroundColor : "#49ffe4"
                                    }
                                },
                                {
                                    type : "rect",
                                    style : {
                                        x : 300,
                                        y : 10,
                                        width : 80,
                                        height : 80,
                                        backgroundColor : "#2a2dff"
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    type : "button",
                    style : Object.assign({}, commonStyle.buttonStyle, {
                        x : 940,
                        y : 10,
                        autoWidth : true,
                        height : 30
                    }),
                    animation : commonAnimation.buttonAnimation,
                    text : "放大",
                    events : {
                        "click" : {
                            callback : "zoomIn",
                            param : (self)=>{
                                return "drag2";
                            }
                        }
                    }
                },
                {
                    type : "button",
                    style : Object.assign({}, commonStyle.buttonStyle, {
                        x : 940,
                        y : 50,
                        autoWidth : true,
                        height : 30
                    }),
                    animation : commonAnimation.buttonAnimation,
                    text : "缩小",
                    events : {
                        "click" : {
                            callback : "zoomOut",
                            param : (self)=>{
                                return "drag2";
                            }
                        }
                    }
                }
            ]
        }
    ]
};