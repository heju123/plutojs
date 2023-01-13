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
import evalUtil from "./util/evalUtil";

import Component from "./ui/components/component";
import Sprite from "./ui/components/game/sprite";
import Router from "./ui/components/router";
import Button from "./ui/components/button";
import Checkbox from "./ui/components/checkbox";
import Input from "./ui/components/input";
import Rect from "./ui/components/rect";
import Scrollbar from "./ui/components/scrollbar";

import ArcPath from "./ui/draw/path/arcPath";
import PointPath from "./ui/draw/path/pointPath";
import Path from "./ui/draw/path/path";
import Arc from "./ui/draw/arc";
import Point from "./ui/draw/point";
import SequenceDraw from "./ui/draw/sequenceDraw";
import QuadraticCurve from "./ui/draw/quadraticCurve";
import BezierCurve from "./ui/draw/bezierCurve";

import Acceleration from "./effect/physics/acceleration";
import Collision from "./effect/physics/collision";
import Friction from "./effect/physics/friction";
import Physics from "./effect/physics/physics";
import PhysicsQueue from "./effect/physics/physicsQueue";
import Speed from "./effect/physics/speed";

import BaseParticle from "./effect/particle/baseParticle";
import Particle from "./effect/particle/particle";

import Stack from "./data/structure/stack";
import LinkedItem from "./data/structure/linkedItem";
import LinkedList from "./data/structure/linkedList";

import Cache from "./cache/cache";

import DomImage from "./ui/dom/domImage";

import MouseEvent from "./event/type/mouseEvent";
import ClickEvent from "./event/type/clickEvent";
import KeyEvent from "./event/type/keyEvent";
import WheelEvent from "./event/type/wheelEvent";

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
        mainBody.innerHTML = '';
        this.fps = new Fps(mainBody);

        globalUtil.action = {};

        //输入框输入监听
        if (!globalUtil.action.inputListenerDom){
            globalUtil.action.inputListenerDom = document.createElement("TEXTAREA");
            globalUtil.action.inputListenerDom.style.position = "fixed";
            globalUtil.action.inputListenerDom.style.left = "0px";
            globalUtil.action.inputListenerDom.style.top = "0px";
            globalUtil.action.inputListenerDom.style.opacity = 0;
            globalUtil.action.inputListenerDom.style["z-index"] = -1;
            mainBody.appendChild(globalUtil.action.inputListenerDom);
        }

        //字符串长度检测
        if (!globalUtil.action.measureTextDom){
            globalUtil.action.measureTextDom = document.createElement("DIV");
            globalUtil.action.measureTextDom.style["display"] = "inline-block";
            globalUtil.action.measureTextDom.style.position = "fixed";
            globalUtil.action.measureTextDom.style.left = "0px";
            globalUtil.action.measureTextDom.style.top = "0px";
            globalUtil.action.measureTextDom.style.opacity = 0;
            globalUtil.action.measureTextDom.style["z-index"] = -1;
            mainBody.appendChild(globalUtil.action.measureTextDom);
        }

        //屏蔽鼠标右键菜单
        mainBody.oncontextmenu = function(e){
            e.preventDefault();
        };
    }

    public setMainView(viewCfg : any){
        this.fps.setMainView(viewCfg);
        this.fps.startLoop();
    }

    public getViewState(){
        this.fps.viewState;
    }

    public run(viewCfg : any){
        this.setMainView(viewCfg);
    }

    /** 如果重新new一个Main实例，之前的那个Main一定要调用stop，不然会有意想不到的bug */
    public stop(){
        this.fps.endLoop();
    }
}
export {Main,commonUtil,httpUtil,Thread,Controller,MPromise,animationUtil,evalUtil,Component,Sprite,Router,Button,Checkbox,Input,Rect,Scrollbar,
    ArcPath,PointPath,Path,Arc,Point,SequenceDraw,QuadraticCurve,BezierCurve,
    Acceleration,Collision,Friction,Physics,PhysicsQueue,Speed,
    BaseParticle,Particle,Stack,LinkedItem,LinkedList,
    Cache,
    DomImage,
    ClickEvent, MouseEvent, KeyEvent, WheelEvent};