# plutojs
## 介绍
	基于canvas开发的游戏框架
## 安装及使用方式
> 将plutojs.js引入到项目中，可以通过window.plutojs获取对象

## 接口及调用方式
### 初始化
```javascript
let obj = new window.plutojs.Main(dom);//dom：dom元素
obj.run(view);//view：json格式对象
```
### 获取组件对象
component.getComponentById：用id获取单个组件   
component.getComponentByName：用name获取单个组件   
component.getComponentsByName：用name获取组件数组
### 视图文件例子
```javascript
import MainController from "../controller/mainController.js";

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
    }
}
```
## 组件属性
### 通用属性
#### parent
父组件对象
#### children
子节点数组
#### active
是否显示组件
#### hasClip
是否遮挡子组件，类似css的overflow:hidden
#### text
显示的文本内容
#### style.textAlign
文字显示方式；例：center
#### style.x
x坐标，相对于父组件
#### style.y
y坐标，相对于父组件
#### style.width
宽度
#### style.height
高度
#### style.lineHeight
行高度，类似css的line-height
#### style.backgroundColor
背景颜色
#### style.backgroundImage
背景图片
#### style.fontFamily
字体；例："Microsoft YaHei"
#### style.fontSize
字体大小；例：14px
#### style.fontColor
字体颜色
#### style.zIndex
类似css的z-index
#### style.multiLine
是否多行文本，设置text属性后文字内容是否可以换行，默认true
#### style.autoLine
是否自动换行
#### style.scale
缩放比例；例："1.0,1.0"
#### style.rotate
旋转角度，角度为单位
#### style.mirror
镜像翻转；例：horizontal水平翻转，vertical垂直翻转
#### style.shadow
设置阴影；注意：如果当前rect设置了背景图片，阴影绘制不出来，应该是canvas问题，这种情况下只能多套一层实现
例：
```javascript
export default {
    type: "rect",
    style : {
      shadow: {
           x: 0,
           y: 0,
           blur: 20,
           color: '#939393'
       }
    }
}
```
#### style.alwaysDraw
组件在被遮挡的情况下是否仍然需要绘制
#### animation
动画属性；
例：
```javascript
export default {
                     type: "rect",
                     style : {
                       x: 0,
                       y: 0,
                       width: "100%",
                       height: "100%"
                     },
                     animation : {
                       scale: {
                         duration: "200ms",
                         easeType: "Linear",
                         easing: "easeOut"
                       }
                     }
}
```
easing和easeType设置参照TweenLite的easing
### Rect矩形组件
#### style.borderWidth
边框宽度
#### style.borderColor
边框颜色
#### style.borderRadius
圆角边框，设置圆角半径
#### style.draggable
是否支持拖动
### Button按钮
### Checkbox
### Input输入框
### Scrollbar滚动条
例：
```javascript
export default {
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
                         //scrollbar的children如果超过scrollbar大小会自动生成滚动条                           
                    ]
                }
            ]
}
```
### Router路由
例：
```javascript
import mainView from "./mainView.js";

export default {
    id : "mainRoute",
    type : "route",
    routes : {
        "main" : {
            view : mainView,
            default : true
        },
        "movement" : {
            view : (get) => {
                return new Promise((resolve, reject)=>{//异步加载movementView.js
                    require.ensure([], require => {
                        get(require("./movement/movementView.js").default, resolve, reject);
                    },'movementView');
                });
            }
        },
        "test" : {
            view : (get) => {
                return new Promise((resolve, reject)=>{
                    require.ensure([], require => {
                        get(require("./test1View.js").default, resolve, reject);
                    },'test1View');
                });
            }
        }
    }
}
```
切换路由调用：
```javascript
let mainRoute = this.viewState.getComponentById("mainRoute");
mainRoute.changeRoute("test");
```
## 事件
事件绑定可以在json里配置events属性
例：
```javascript
import MainController from "./mainController";
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
        }
}
```
然后在MainController中定义clickMain和mouseDown方法可以接受事件回调
手动注册事件：
```javascript
component.registerEvent("mousedown", function(e){
    console.log(e);
});
```
移除事件：
```javascript
component.removeEvent("mousemove", fun);//fun为注册事件时传入的function对象，注意必须是同一个function对象
```
手动触发事件
```javascript
component.triggerEvent("click");
```
### 事件类型
#### click
点击事件
#### mousedown
#### mousemove
#### mouseup
#### keydown
#### keyup
#### mousewheel
鼠标滚轮事件，e.wheelDelta小于0是向上滚动
#### startDrag
开始拖动，必须设置style.draggable属性
#### onDrag
拖动过程当中，必须设置style.draggable属性
#### endDrag
停止拖动，必须设置style.draggable属性
注：拖动事件不能冒泡
#### $onViewLoaded
组件加载完成事件
## 布局
目前只支持linearLayout线性布局
例：
```javascript
export default {
    type : "rect",
    style : {
        x : 0,
        y : 0,
        width : "100%",
        height : "100%",
        layout : {
            type : "linearLayout",
            orientation : "horizontal"
        }
    },
    children : [
        {
            type : "rect",
            style : {
                width : "100%",
                backgroundColor : "#60ba4c",
                layout : {
                     layoutWeight : 1,//占用的大小权值
                     contentAlign : "center"//如果是垂直布局组件是否水平居中，反之亦然
                }
            }
        },
        {
             type : "rect",
             style : {
                   width : "100%",
                   backgroundColor : "#60ba4c",
                   layout : {
                      layoutWeight : 2
                   }
             }
        }
    ]
}
```
orientation : "horizontal"：水平布局   
orientation : "vertical"：垂直布局
##外部提供
### window.plutojs.Main
主对象
### window.plutojs.commonUtil
通用方法封装
### window.plutojs.httpUtil
网络请求
### window.plutojs.Thread
线程
### window.plutojs.Controller
定义controller时需集成此类
### window.plutojs.MPromise
异步执行封装
### window.plutojs.animationUtil
动画组件
例：
```javascript
window.plutojs.animationUtil.executeAttrChange(obj, {
           x : 10,
           y : 10
 }, {
            delay : 100,
            duration : 1,//秒
            easeType : "Linear",
            easing : "ease"
          });
```
### 对外提供组件
window.plutojs.components.Button  
window.plutojs.components.Checkbox  
window.plutojs.components.Input  
window.plutojs.components.Rect  
window.plutojs.components.Scrollbar
window.plutojs.components.Sprite
window.plutojs.components.Router   
### 对外提供绘制封装
window.plutojs.draw.ArcPath
window.plutojs.draw.PointPath
window.plutojs.draw.Path
window.plutojs.draw.Arc
window.plutojs.draw.Point
window.plutojs.draw.SequenceDraw   
### 对外提供的通用插件
window.plutojs.util.Thread
window.plutojs.util.MPromise
window.plutojs.util.commonUtil
window.plutojs.util.httpUtil
window.plutojs.util.animationUtil