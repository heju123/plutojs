import LayoutTestController from "../controller/layoutTestController";

export default {
    type : "rect",
    controller : LayoutTestController,
    style : {
        x : 540,
        y : 40,
        width : "40%",
        height : 400,
        backgroundColor : "#dadada",
        zIndex : 8,
        layout : {
            type : "linearLayout",
            orientation : "horizontal"
        }
    },
    children : [
        {
            name : "scrollbarTest",
            type : "rect",
            style : {
                width : "50%",
                height : "100%"
            },
            children : [
                {
                    type : "scrollbar",
                    children : [
                        {
                            type : "rect",
                            style : {
                                x : 0,
                                y : 0,
                                width : "100%",
                                autoHeight : true,
                                backgroundColor : "#bab71d",
                                layout : {
                                    type : "linearLayout",
                                    orientation : "vertical"
                                }
                            },
                            children : [
                                {
                                    id : "layout_rectGreen",
                                    type : "rect",
                                    style : {
                                        width : "100%",
                                        height : 300,
                                        backgroundColor : "#60ba4c",
                                        layout : {
                                            layoutWeight : 1
                                        }
                                    },
                                    events : {
                                        "click": "clickGreen"
                                    }
                                },
                                {
                                    type : "rect",
                                    style : {
                                        width : "100%",
                                        height : 400,
                                        backgroundColor : "#ba333a",
                                        layout : {
                                            layoutWeight : 2
                                        }
                                    },
                                    events : {
                                        "click": "removeEvent"
                                    }
                                },
                                {
                                    type : "rect",
                                    style : {
                                        width : "100%",
                                        height : 400,
                                        backgroundColor : "#5051ba",
                                        layout : {
                                            layoutWeight : 1
                                        }
                                    }
                                },
                                {
                                    type : "rect",
                                    style : {
                                        width : "100%",
                                        height : 400,
                                        backgroundColor : "#7096ba",
                                        layout : {
                                            layoutWeight : 1
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            type : "rect",
            style : {
                width : "50%",
                height : "100%",
                backgroundColor : "#bfbfbf",
                layout : {
                    type : "linearLayout",
                    orientation : "horizontal",
                    autoLine : true
                }
            },
            children : [
                {
                    type : "rect",
                    style : {
                        width : 150,
                        height : 40,
                        backgroundColor : "#7096ba"
                    }
                },
                {
                    type : "rect",
                    style : {
                        width : 150,
                        height : 40,
                        backgroundColor : "#4b7cba"
                    }
                },
                {
                    type : "rect",
                    style : {
                        width : 150,
                        height : 40,
                        backgroundColor : "#634aba"
                    }
                }
            ]
        }
    ]
}