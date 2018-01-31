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

import Component from "./ui/components/component";
import Sprite from "./ui/components/game/sprite";
import Router from "./ui/components/router";
import Button from "./ui/components/button";
import Checkbox from "./ui/components/checkbox";
import Input from "./ui/components/input";
import Rect from "./ui/components/rect";
import Scrollbar from "./ui/components/scrollbar";

import CurvePath from "./ui/draw/path/curvePath";
import PointPath from "./ui/draw/path/pointPath";
import Path from "./ui/draw/path/path";
import Curve from "./ui/draw/curve";
import Point from "./ui/draw/point";
import SequenceDraw from "./ui/draw/sequenceDraw";

class Main {
    fps : Fps;

    constructor(eleId : HTMLElement | string){
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

        globalUtil.action = {};

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

    setMainView(viewCfg : any){
        this.fps.setMainView(viewCfg);
        this.fps.startLoop();
    }

    run(viewCfg : any){
        this.setMainView(viewCfg);
    }
}
export {Main,commonUtil,httpUtil,Thread,Controller,MPromise,animationUtil,Component,Sprite,Router,Button,Checkbox,Input,Rect,Scrollbar,
    CurvePath,PointPath,Path,Curve,Point,SequenceDraw};