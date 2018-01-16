webpackJsonp([0],{

/***/ 20:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by heju on 2017/7/21.
 */
var test1Controller_js_1 = __webpack_require__(43);
exports.default = {
    controller: test1Controller_js_1.default,
    type: "rect",
    style: {
        x: 40,
        y: 240,
        width: 100,
        height: 100,
        draggable: true,
        backgroundColor: "#0000ff",
        zIndex: 9,
        scale: "1,1",
        rotate: 0,
        hover: {
            scale: "1.25,1.25",
            rotate: 20
        }
    },
    animation: {
        scale: {
            duration: "200ms",
            easeType: "Linear",
            easing: "easeOut"
        },
        rotate: {
            duration: "200ms",
            easeType: "Linear",
            easing: "easeOut"
        }
    },
    events: {
        "click": "changeRoute"
    },
    children: [
        {
            type: "rect",
            style: {
                x: 60,
                y: 50,
                autoWidth: true,
                autoHeight: true,
                backgroundImage: "/src/images/default_man.png",
                alpha: 1.0,
                hover: {
                    backgroundImage: "/src/images/man.png"
                }
            },
            events: {
                "click": {
                    callback: "imgClick",
                    param: function (self) {
                        return [self.width, self.height];
                    }
                }
            }
        },
        {
            type: "rect",
            style: {
                x: -10,
                y: -10,
                width: 80,
                height: 80,
                backgroundColor: "#15c9ff"
            },
            text: "法大f师傅eg大师傅大师傅士大夫士大夫士大efege夫法大师傅大gre师傅大师傅wfe士大夫士大夫士大夫法大师傅大",
            children: [
                {
                    type: "rect",
                    style: {
                        x: -20,
                        y: 20,
                        width: 50,
                        height: 50,
                        backgroundColor: "#128db6"
                    }
                }
            ]
        }
    ]
};


/***/ }),

/***/ 43:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by heju on 2017/7/21.
 */
var main_1 = __webpack_require__(4);
var Test1Controller = /** @class */ (function (_super) {
    __extends(Test1Controller, _super);
    function Test1Controller(component) {
        return _super.call(this, component) || this;
        // this.component.registerEvent("click", (e)=>{
        //     console.log("test1");
        // });
        // this.component.registerEvent("click", (e)=>{
        //     console.log("click");
        // });
        //
        // this.component.registerEvent("mousedown", function(e){
        //     console.log("mousedown");
        // });
        //
        // this.component.registerEvent("mousemove", function(e){
        //     console.log("mousemove");
        // });
        //
        // this.component.registerEvent("mouseup", function(e){
        //     console.log("mouseup");
        // });
        //
        // this.component.registerEvent("keydown", function(e){
        //     console.log("keydown");
        // });
        // this.component.registerEvent("keyup", function(e){
        //     console.log("keyup");
        // });
    }
    Test1Controller.prototype.onClick = function (e) {
        console.log("panel click");
    };
    Test1Controller.prototype.imgClick = function (width, e) {
        console.log(width);
    };
    Test1Controller.prototype.changeRoute = function (e) {
        var mainRoute = this.viewState.getComponentById("mainRoute");
        mainRoute.changeRoute("main");
    };
    return Test1Controller;
}(main_1.Controller));
exports.default = Test1Controller;


/***/ })

});
//# sourceMappingURL=test1View.chunk.js.map