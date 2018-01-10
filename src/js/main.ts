/**
 * Created by heju on 2017/7/10.
 */
import Fps from "./ui/fps";
import httpUtil from "./util/httpUtil";
import commonUtil from "./util/commonUtil";
import globalUtil from "./util/globalUtil";
import Thread from "./util/thread";
import Controller from "./ui/controller";
import MPromise from "./util/promise";
import animationUtil from "./util/animationUtil";

import Sprite from "./ui/components/game/sprite";
import Button from "./ui/components/button";
import Checkbox from "./ui/components/checkbox";
import Input from "./ui/components/input";
import Rect from "./ui/components/rect";
import Scrollbar from "./ui/components/scrollbar";

class Main {
    fps : Fps;

    constructor(eleId){
        let mainBody : any;
        if (typeof(eleId) === "string")
        {
            mainBody = document.getElementById(eleId);
        }
        else
        {
            mainBody = eleId;
        }
        this.fps = new Fps(mainBody);

        (<any>globalUtil).action = {};
        (<any>window).monk.action = (<any>globalUtil).action;

        //输入框输入监听
        (<any>globalUtil).action.inputListenerDom = document.createElement("TEXTAREA");
        (<any>globalUtil).action.inputListenerDom.style.position = "fixed";
        (<any>globalUtil).action.inputListenerDom.style.left = "0px";
        (<any>globalUtil).action.inputListenerDom.style.top = "0px";
        (<any>globalUtil).action.inputListenerDom.style.opacity = 0;
        (<any>globalUtil).action.inputListenerDom.style["z-index"] = -1;
        document.body.appendChild((<any>globalUtil).action.inputListenerDom);

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

(<any>window).monk = {
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