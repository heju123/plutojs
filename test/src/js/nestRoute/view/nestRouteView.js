import commonStyle from "@/js/common//view/style/commonStyle";
import commonAnimation from "@/js/common//view/animation/commonAnimation";
import NestRouteController from "../controller/nestRouteController";
import {getLinkView} from "@/js/common/view/components";
import {topView,topHeight} from "@/js/common/view/top/topView";
import {commonUtil} from "~/js/main";

let route = {
    id : "nestRoute",
    type : "route",
    routes : {}
};

commonUtil.copyObject(require("../route1/route").default, route.routes, false);
commonUtil.copyObject(require("../route2/route").default, route.routes, false);

let output = {
    controller : NestRouteController,
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
                    type : "rect",
                    style : {
                        x : 10,
                        y : 0,
                        width : "100%",
                        height : 40,
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
                                x : 0,
                                autoWidth : true,
                                height : 30
                            }),
                            animation : commonAnimation.buttonAnimation,
                            text : "路由1",
                            events : {
                                "click" : {
                                    callback : "changeRoute",
                                    param : (self)=>{
                                        return ["nestRoute.route1"];
                                    }
                                }
                            }
                        },
                        {
                            type : "button",
                            style : Object.assign({}, commonStyle.buttonStyle, {
                                x : 0,
                                autoWidth : true,
                                height : 30
                            }),
                            animation : commonAnimation.buttonAnimation,
                            text : "路由2",
                            events : {
                                "click" : {
                                    callback : "changeRoute",
                                    param : (self)=>{
                                        return ["nestRoute.route2"];
                                    }
                                }
                            }
                        }
                    ]
                },
                {
                    type : "rect",
                    style : {
                        x : 0,
                        y : 60,
                        width : "100%",
                        height : 500,
                        borderWidth : 2,
                        borderColor : "#ababab"
                    },
                    children : [
                        route
                    ]
                }
            ]
        }
    ]
};
export default output;