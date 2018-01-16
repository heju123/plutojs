/**
 * Created by heju on 2017/7/21.
 */
import Test1Controller from "../controller/test1Controller.js";

export default {
    controller : Test1Controller,
    type : "rect",
    style : {
        x : 40,
        y : 240,
        width : 100,
        height : 100,
        draggable : true,
        backgroundColor : "#0000ff",
        zIndex : 9,
        scale : "1,1",
        rotate : 0,
        hover : {
            scale : "1.25,1.25",
            rotate : 20
        }
    },
    animation : {
        scale : {
            duration : "200ms",
            easeType : "Linear",
            easing : "easeOut"
        },
        rotate : {
            duration : "200ms",
            easeType : "Linear",
            easing : "easeOut"
        }
    },
    events : {
        "click" : "changeRoute"
    },
    children : [
        {
            type : "rect",
            style : {
                x : 60,
                y : 50,
                autoWidth : true,
                autoHeight : true,
                backgroundImage : "/images/default_man.png",
                alpha : 1.0,
                hover : {
                    backgroundImage : "/images/man.png"
                }
            },
            events : {
                "click" : {
                    callback : "imgClick",
                    param : (self)=>{
                        return [self.width, self.height];
                    }
                }
            }
        },
        {
            type : "rect",
            style : {
                x : -10,
                y : -10,
                width : 80,
                height : 80,
                backgroundColor : "#15c9ff"
            },
            text : "法大f师傅eg大师傅大师傅士大夫士大夫士大efege夫法大师傅大gre师傅大师傅wfe士大夫士大夫士大夫法大师傅大",
            children : [
                {
                    type : "rect",
                    style : {
                        x : -20,
                        y : 20,
                        width : 50,
                        height : 50,
                        backgroundColor : "#128db6"
                    }
                }
            ]
        }
    ]
};