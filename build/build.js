import {
    Main,
    commonUtil,
    httpUtil,
    Thread,
    Controller,
    MPromise,
    animationUtil,
    Component,
    Sprite,
    Button,
    Checkbox,
    Input,
    Rect,
    Scrollbar
} from "~/js/main";

window.plutojs = {
    Main : Main,
    Controller : Controller,
    utils : {
        Thread : Thread,
        MPromise : MPromise,
        commonUtil : commonUtil,
        httpUtil : httpUtil,
        animationUtil : animationUtil
    },
    components : {
        Component : Component,
        Sprite : Sprite,
        Button : Button,
        Checkbox : Checkbox,
        Input : Input,
        Rect : Rect,
        Scrollbar : Scrollbar
    }
};