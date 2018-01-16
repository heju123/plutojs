import MainController from "../controller/mainController";
import ChildController from "../controller/childController.js";
import layoutTestView from "./layoutTestView.js";

export default {
    controller : MainController,
    type : "rect",
    style : {
        x : 0,
        y : 0,
        width : "100%",
        height : "100%",
        backgroundColor : "#ffffff"
    },
    events : {
        "click" : "clickMain",
        "mousedown" : "mouseDown"
    },
    children : [
        {
            name : "child1",
            controller : ChildController,
            type : "rect",
            style : {
                x : 10,
                y : 10,
                width : 200,
                height : 200,
                backgroundColor : "#5789ff",
                borderWidth : 10,
                borderRadius : 40,
                borderColor : "#161616",
                hover : function(){
                    this.setStyle("backgroundColor", "#9daaff");
                },
                hoverout : function(){
                    this.setStyle("backgroundColor", "#5789ff");
                },
                active : {
                    backgroundColor : "#ffd45d"
                }
            },
            children : [
                {
                    type : "rect",
                    style : {
                        x : 140,
                        y : 140,
                        width : "60%",
                        height : "60%",
                        backgroundImage : "/src/images/bg.jpeg"
                    },
                    children : [
                        {
                            type : "rect",
                            style : {
                                x : 10,
                                y : 10,
                                width : "60%",
                                height : "60%",
                                backgroundColor : "#21ba31"
                            },
                            text : "反对反对法大幅度反对法大幅度反对法地方"
                        },
                        {
                            type : "input",
                            name : "input",
                            style : {
                                x : 0,
                                y : -15,
                                width : 100,
                                height : 30,
                                backgroundColor : "#bababa",
                                borderWidth : 1,
                                borderColor : "#7a7a7a",
                                borderRadius : 5,
                                focus : {
                                    borderColor : "#ff0000"
                                },
                                hover : {
                                    borderColor : "#383838"
                                },
                                active : {
                                    borderColor : "#ffd45d"
                                }
                            }
                        }
                    ]
                },
                {
                    type : "rect",
                    style : {
                        x : -50,
                        y : -50,
                        width : 100,
                        height : 100,
                        backgroundColor : "#ff9d42"
                    }
                }
            ]
        },
        {
            type : "button",
            style : {
                x : 240,
                y : 20,
                autoWidth : true,
                height : 30,
                backgroundColor : "#afafaf",
                borderWidth : 1,
                borderColor : "#303030",
                hover : {
                    x : 250,
                    backgroundColor : "#22af29",
                    fontColor : "#fff"
                }
            },
            events : {
                "click" : "goMovement"
            },
            text : '测试按钮',
            animation : {
                x : {
                    duration : "1000ms",
                    easeType : "Elastic",
                    easing : "easeOut"
                },
                backgroundColor : {
                    duration : "0.5s",
                    easeType : "Linear",
                    easing : "easeOut",
                    repeat : 2
                }
            }
        },
        {
            type: "rect",
            style: {
                x: 400,
                y: 125,
                width: 120,
                height: 30,
                lineHeight : 30,
                textAlign : "center",
                backgroundColor: "#afafaf",
                borderWidth: 1,
                borderColor: "#303030"
            },
            text : "text间隙测试"
        },
        {
            type : "button",
            style : {
                x : 340,
                y : 20,
                autoWidth : true,
                height : 30,
                backgroundColor : "#afafaf",
                borderWidth : 1,
                borderColor : "#303030",
                hover : {
                    backgroundColor : "#22af29",
                    fontColor : "#fff"
                }
            },
            events : {
                "click" : "getAllInput"
            },
            text : '获取所有输入框'
        },
        {
            type : "input",
            name : "input",
            style : {
                x : 270,
                y : 160,
                width : 100,
                height : 160,
                backgroundImage : "/src/images/bg.jpeg",
                borderWidth : 4,
                //borderRadius : 30,
                borderColor : "#7a7a7a",
                multiLine : true,
                scale : "1,1",
                focus : {
                    borderColor : "#ff0000"
                },
                hover : {
                    borderColor : "#383838",
                    scale : "1.25,1.25",
                    mirror : "horizontal"
                    //rotate : 20,
                },
                active : {
                    borderColor : "#ffd45d"
                }
            },
            animation : {
                scale : {
                    duration : "500ms",
                    easeType : "Elastic",
                    easing : "easeOut"
                }
            },
            events : {
                "mousedown" : "mousedownInput"
            }
        },
        {
            type : "input",
            name : "input",
            style : {
                x : 420,
                y : 420,
                width : 100,
                height : 30,
                backgroundColor : "#bababa",
                borderWidth : 1,
                borderColor : "#7a7a7a",
                textAlign : "center",
                borderRadius : 5,
                readOnly : true,
                focus : {
                    borderColor : "#ff0000"
                },
                hover : {
                    borderColor : "#383838"
                },
                active : {
                    borderColor : "#ffd45d"
                }
            },
            text : "readOnly"
        },
        {
            type : "rect",
            style : {
                x : 360,
                y : 350,
                width : 32,
                height : 32,
                backgroundImage : "/src/images/tip_msg.png",
                backgroundImageClip : [0,128,32,32],
                hover : {
                    mirror : "horizontal"
                }
            },
            events : {
                "click" : "changeRoute"
            }
        },
        (get) => {
            return new Promise((resolve, reject)=>{
                require.ensure([], require => {
                    get(require("./test1View.js").default, resolve, reject);
                },'test1View');
            });
        },
        layoutTestView,
        {
            type : "checkbox",
            style : {
                x : 340,
                y : 100,
                width : 20,
                height : 20,
                lineWidth : 3
            },
            checked : true,
            events : {
                "click" : "onClickCheckbox"
            }
        }
    ]
};