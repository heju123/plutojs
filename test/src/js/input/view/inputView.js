import commonStyle from "@/js/common//view/style/commonStyle";
import {commonUtil} from "~/js/main";
import InputController from "../controller/inputController";
import {getLinkView} from "@/js/common/view/components";
import {topView,topHeight} from "@/js/common/view/top/topView";

const PADDING_LEFT = 20;
const FORM_ROW_HEIGHT = 60;

export default {
    controller : InputController,
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
                                            type : "input",
                                            style : Object.assign({}, commonStyle.inputStyle, {
                                                x : PADDING_LEFT,
                                                y : function(){
                                                    return this.parent.getHeight() / 2 - this.getHeight() / 2;
                                                },
                                                width : 300,
                                                height : 30
                                            })
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
                                            type : "input",
                                            style : Object.assign({}, commonStyle.inputStyle, {
                                                x : PADDING_LEFT,
                                                y : function(){
                                                    return this.parent.getHeight() / 2 - this.getHeight() / 2;
                                                },
                                                width : 300,
                                                height : 30,
                                                backgroundColor : "#d7d7d7",
                                                readOnly : true
                                            }),
                                            text : "readOnly"
                                        }
                                    ]
                                },
                                {
                                    type : "rect",
                                    name : "row",
                                    style : {
                                        x : 0,
                                        width : "100%",
                                        height : 200
                                    },
                                    children : [
                                        {
                                            type : "input",
                                            style : Object.assign({}, commonStyle.inputStyle, {
                                                x : PADDING_LEFT,
                                                y : function(){
                                                    return this.parent.getHeight() / 2 - this.getHeight() / 2;
                                                },
                                                width : 300,
                                                height : 160,
                                                multiLine : true,
                                                autoLine : true
                                            })
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