import MovementController from "../../controller/movement/movementController.js";
import MapTestController from "../../controller/movement/mapTestController.js";

export default {
    type : "rect",
    controller : MovementController,
    style : {
        x : 0,
        y : 0,
        width : "100%",
        height : "100%",
        backgroundColor : "#fff"
    },
    children : [
        {
            type : "rect",
            style : {
                x : 0,
                y : 0,
                width : "100%",
                height : 60,
                backgroundColor : "#ccc"
            },
            children : [
                {
                    type : "button",
                    style : {
                        width : 100,
                        height : 30,
                        x : 10,
                        y : function(){
                            return this.parent.getHeight() / 2 - this.getHeight() / 2
                        },
                        borderWidth : 1,
                        borderColor : "#949494",
                        backgroundColor : "#adadad",
                        hover : {
                            backgroundColor : "#bbbbbb"
                        }
                    },
                    text : "返回",
                    events : {
                        "click" : "back"
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
                backgroundColor : "#f1f1f1",
                height : function(){
                    return this.parent.getHeight() - 60;
                }
            },
            children : [
                {
                    name : "mapTest",
                    type : "map",
                    controller : MapTestController,
                    style : {
                        x : 10,
                        y : 10,
                        backgroundColor : "#dbdbdb"
                    },
                    mapDataUrl : "/maps/test1.map",
                    terrainPolicy : {
                        "block" : {
                            backgroundColor : "#000000"
                        },
                        1 : {
                            backgroundColor : "#94d6f1"
                        }
                    },
                    children : [
                        {
                            name : "sprite1",
                            type : "sprite",
                            style : {
                                x : 160,
                                y : 40,
                                backgroundColor : "#ff0000"
                            }
                        }
                    ]
                }
            ]
        }
    ]
}