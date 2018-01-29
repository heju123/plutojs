import commonStyle from "@/js/common//view/style/commonStyle";
import NestRouteController from "../controller/nestRouteController";
import {getLinkView} from "@/js/common/view/components";
import {topView,topHeight} from "@/js/common/view/top/topView";

export default {
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
            ]
        }
    ]
};