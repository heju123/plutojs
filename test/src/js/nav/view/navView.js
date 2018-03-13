import commonStyle from "@/js/common//view/style/commonStyle";
import NavController from "../controller/navController";
import {getLinkView} from "@/js/common/view/components";
import {topView,topHeight} from "@/js/common/view/top/topView";

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
                                getLinkView("首页", {
                                    style : {
                                        fontSize : "18px"
                                    },
                                    events : {
                                        "click" : {
                                            callback : "goLink",
                                            param : (self)=>{
                                                return ["main"];
                                            }
                                        }
                                    }
                                }),
                                getLinkView("draw test", {
                                    style : {
                                        fontSize : "18px"
                                    },
                                    events : {
                                        "click" : {
                                            callback : "goLink",
                                            param : (self)=>{
                                                return ["draw"];
                                            }
                                        }
                                    }
                                }),
                                getLinkView("输入框", {
                                    style : {
                                        fontSize : "18px"
                                    },
                                    events : {
                                        "click" : {
                                            callback : "goLink",
                                            param : (self)=>{
                                                return ["input"];
                                            }
                                        }
                                    }
                                }),
                                getLinkView("按钮", {
                                    style : {
                                        fontSize : "18px"
                                    },
                                    events : {
                                        "click" : {
                                            callback : "goLink",
                                            param : (self)=>{
                                                return ["button"];
                                            }
                                        }
                                    }
                                }),
                                getLinkView("复选框", {
                                    style : {
                                        fontSize : "18px"
                                    },
                                    events : {
                                        "click" : {
                                            callback : "goLink",
                                            param : (self)=>{
                                                return ["checkbox"];
                                            }
                                        }
                                    }
                                }),
                                getLinkView("嵌套路由", {
                                    style : {
                                        fontSize : "18px"
                                    },
                                    events : {
                                        "click" : {
                                            callback : "goLink",
                                            param : (self)=>{
                                                return ["nestRoute"];
                                            }
                                        }
                                    }
                                }),
                                getLinkView("滚动条与布局", {
                                    style : {
                                        fontSize : "18px"
                                    },
                                    events : {
                                        "click" : {
                                            callback : "goLink",
                                            param : (self)=>{
                                                return ["scrollbar"];
                                            }
                                        }
                                    }
                                }),
                                getLinkView("遮挡测试", {
                                    style : {
                                        fontSize : "18px"
                                    },
                                    events : {
                                        "click" : {
                                            callback : "goLink",
                                            param : (self)=>{
                                                return ["cliptest"];
                                            }
                                        }
                                    }
                                }),
                                getLinkView("粒子效果", {
                                    style : {
                                        fontSize : "18px"
                                    },
                                    events : {
                                        "click" : {
                                            callback : "goLink",
                                            param : (self)=>{
                                                return ["particleEffects"];
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