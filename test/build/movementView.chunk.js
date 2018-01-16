webpackJsonp([1],{

/***/ 42:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var movementController_js_1 = __webpack_require__(44);
var mapTestController_js_1 = __webpack_require__(46);
exports.default = {
    type: "rect",
    controller: movementController_js_1.default,
    style: {
        x: 0,
        y: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "#fff"
    },
    children: [
        {
            type: "rect",
            style: {
                x: 0,
                y: 0,
                width: "100%",
                height: 60,
                backgroundColor: "#ccc"
            },
            children: [
                {
                    type: "button",
                    style: {
                        width: 100,
                        height: 30,
                        x: 10,
                        y: function () {
                            return this.parent.getHeight() / 2 - this.getHeight() / 2;
                        },
                        borderWidth: 1,
                        borderColor: "#949494",
                        backgroundColor: "#adadad",
                        hover: {
                            backgroundColor: "#bbbbbb"
                        }
                    },
                    text: "返回",
                    events: {
                        "click": "back"
                    }
                }
            ]
        },
        {
            type: "rect",
            style: {
                x: 0,
                y: 60,
                width: "100%",
                backgroundColor: "#f1f1f1",
                height: function () {
                    return this.parent.getHeight() - 60;
                }
            },
            children: [
                {
                    name: "mapTest",
                    type: "map",
                    controller: mapTestController_js_1.default,
                    style: {
                        x: 10,
                        y: 10,
                        backgroundColor: "#dbdbdb"
                    },
                    mapDataUrl: "/src/maps/test1.map",
                    terrainPolicy: {
                        "block": {
                            backgroundColor: "#000000"
                        },
                        1: {
                            backgroundColor: "#94d6f1"
                        }
                    },
                    children: [
                        {
                            name: "sprite1",
                            type: "sprite",
                            style: {
                                x: 160,
                                y: 40,
                                backgroundColor: "#ff0000"
                            }
                        }
                    ]
                }
            ]
        }
    ]
};


/***/ }),

/***/ 44:
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
var main_1 = __webpack_require__(4);
var spriteAction_js_1 = __webpack_require__(45);
var MovementController = /** @class */ (function (_super) {
    __extends(MovementController, _super);
    function MovementController(component) {
        var _this = _super.call(this, component) || this;
        _this.currentAction = spriteAction_js_1.default.stay;
        _this.registerEvent("$onViewLoaded", function () {
            var map = _this.component.getComponentByName("mapTest");
            _this.sprite = _this.component.getComponentByName("sprite1");
            _this.sprite.status = "stay";
            _this.sprite.yAcceleration = 0.05;
            var speed = 1.5;
            var jumpSpeed = -4;
            _this.sprite.onCollision = function (data) {
                console.log(data);
            };
            _this.setSpriteAction();
            map.registerEvent("keydown", function (e) {
                switch (e.keyCode) {
                    case 87://w
                        _this.sprite.ySpeed = jumpSpeed;
                        break;
                    case 65://a
                        _this.sprite.xSpeed = -speed;
                        _this.setSpriteAction(spriteAction_js_1.default.run);
                        _this.sprite.setStyle("mirror", "horizontal");
                        if (_this.sprite.status === "stay") {
                            _this.sprite.setY(_this.sprite.getY() + (spriteAction_js_1.default.stay.height - spriteAction_js_1.default.run.height) - 1);
                        }
                        _this.sprite.status = "run";
                        break;
                    case 68://d
                        _this.sprite.xSpeed = speed;
                        _this.setSpriteAction(spriteAction_js_1.default.run);
                        _this.sprite.removeStyle("mirror");
                        if (_this.sprite.status === "stay") {
                            _this.sprite.setY(_this.sprite.getY() + (spriteAction_js_1.default.stay.height - spriteAction_js_1.default.run.height) - 1);
                        }
                        _this.sprite.status = "run";
                        break;
                    default: break;
                }
            });
            map.registerEvent("keyup", function (e) {
                switch (e.keyCode) {
                    case 65: //a
                    case 68://d
                        _this.sprite.xSpeed = 0;
                        _this.setSpriteAction(spriteAction_js_1.default.stay);
                        if (_this.sprite.status === "run") {
                            _this.sprite.setY(_this.sprite.getY() - (spriteAction_js_1.default.stay.height - spriteAction_js_1.default.run.height));
                        }
                        _this.sprite.status = "stay";
                        break;
                    default: break;
                }
            });
        });
        return _this;
    }
    MovementController.prototype.setSpriteAction = function (action) {
        if (action) {
            this.currentAction = action;
        }
        this.sprite.setStyle({
            "width": this.currentAction.width,
            "height": this.currentAction.height,
            "backgroundImage": this.currentAction.backgroundImage,
            "backgroundImages": this.currentAction.backgroundImages,
            "backgroundImagesInterval": this.currentAction.backgroundImagesInterval
        });
    };
    MovementController.prototype.back = function (e) {
        console.log(e);
        var mainRoute = this.viewState.getComponentById("mainRoute");
        mainRoute.changeRoute("main", true);
    };
    return MovementController;
}(main_1.Controller));
exports.default = MovementController;


/***/ }),

/***/ 45:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    stay: {
        width: 24,
        height: 56,
        backgroundImage: "/src/images/hero-stay.png",
        backgroundImages: [
            {
                clip: [0, 0, 24, 56]
            },
            {
                clip: [192, 0, 24, 56]
            },
            {
                clip: [384, 0, 24, 56]
            },
            {
                clip: [576, 0, 24, 56]
            }
        ],
        backgroundImagesInterval: 500
    },
    run: {
        width: 48,
        height: 48,
        backgroundImage: "/src/images/hero-run.png",
        backgroundImages: [
            {
                clip: [0, 0, 44, 48]
            },
            {
                clip: [192, 0, 48, 48]
            },
            {
                clip: [384, 0, 48, 48]
            },
            {
                clip: [576, 0, 48, 48]
            },
            {
                clip: [768, 0, 48, 48]
            },
            {
                clip: [0, 192, 48, 48]
            },
            {
                clip: [192, 192, 48, 48]
            },
            {
                clip: [384, 192, 48, 48]
            }
        ],
        backgroundImagesInterval: 500
    }
};


/***/ }),

/***/ 46:
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
var main_1 = __webpack_require__(4);
var MapTestController = /** @class */ (function (_super) {
    __extends(MapTestController, _super);
    function MapTestController(component) {
        return _super.call(this, component) || this;
    }
    MapTestController.prototype.draw = function (ctx) {
    };
    return MapTestController;
}(main_1.Controller));
exports.default = MapTestController;


/***/ })

});
//# sourceMappingURL=movementView.chunk.js.map