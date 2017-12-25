/**
 * Created by heju on 2017/7/10.
 */
import Fps from "./ui/fps.js";
import httpUtil from "./util/httpUtil.js";
import commonUtil from "./util/commonUtil.js";
import globalUtil from "./util/globalUtil.js";
import Thread from "./util/thread.js";
import Controller from "./ui/controller.js";
import MPromise from "./util/promise.js";
import animationUtil from "./util/animationUtil.js";

import Sprite from "./ui/components/game/sprite.js";
import Button from "./ui/components/button.js";
import Checkbox from "./ui/components/checkbox.js";
import Input from "./ui/components/input.js";
import Rect from "./ui/components/rect.js";
import Scrollbar from "./ui/components/scrollbar.js";

class Main {
    constructor(eleId){
        let mainBody;
        if (typeof(eleId) === "string")
        {
            mainBody = document.getElementById(eleId);
        }
        else
        {
            mainBody = eleId;
        }
        this.fps = new Fps(mainBody);

        globalUtil.action = {};
        window.monk.action = globalUtil.action;

        //输入框输入监听
        globalUtil.action.inputListenerDom = document.createElement("TEXTAREA");
        globalUtil.action.inputListenerDom.style.position = "fixed";
        globalUtil.action.inputListenerDom.style.left = "0px";
        globalUtil.action.inputListenerDom.style.top = "0px";
        globalUtil.action.inputListenerDom.style.opacity = 0;
        globalUtil.action.inputListenerDom.style["z-index"] = -1;
        document.body.appendChild(globalUtil.action.inputListenerDom);

        //屏蔽鼠标右键菜单
        mainBody.oncontextmenu = function(e){
            e.preventDefault();
        };
    }

    setMainView(viewCfg){
        this.fps.setMainView(viewCfg);
        this.fps.startLoop();
    }

    run(viewCfg){
        this.setMainView(viewCfg);
    }
}

window.monk = {
    Main : Main,
    commonUtil : commonUtil,
    httpUtil : httpUtil,
    Thread : Thread,
    Controller : Controller,
    MPromise : MPromise,
    animationUtil : animationUtil,
    components : {
        Sprite : Sprite,
        Button : Button,
        Checkbox : Checkbox,
        Input : Input,
        Rect : Rect,
        Scrollbar : Scrollbar
    }
};