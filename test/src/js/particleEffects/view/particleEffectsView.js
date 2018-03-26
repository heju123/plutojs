import commonStyle from "@/js/common//view/style/commonStyle";
import {commonUtil} from "~/js/main";
import {topView,topHeight} from "@/js/common/view/top/topView";
import ParticleEffectsController from "../controller/particleEffectsController";

export default {
    controller : ParticleEffectsController,
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
                            name : "particle1",
                            type : "rect",
                            style : {
                                x : 10,
                                y : 10,
                                width : 300,
                                height : 300,
                                borderWidth : 1,
                                borderColor : "#a0a0a0"
                            }
                        },
                        {
                            name : "particle2",
                            type : "rect",
                            style : {
                                x : 10,
                                y : 350,
                                width : 300,
                                height : 300,
                                borderWidth : 1,
                                borderColor : "#a0a0a0"
                            },
                            events : {
                                "mousemove" : "onParticleAreaMouseMove"
                            }
                        }
                    ]
                }
            ]
        }
    ]
};