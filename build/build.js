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
    Router,
    Button,
    Checkbox,
    Input,
    Rect,
    Scrollbar,
    ArcPath,
    PointPath,
    Path,
    Arc,
    Point,
    SequenceDraw
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
        Router : Router,
        Button : Button,
        Checkbox : Checkbox,
        Input : Input,
        Rect : Rect,
        Scrollbar : Scrollbar
    },
    draw : {
        ArcPath : ArcPath,
        PointPath : PointPath,
        Path : Path,
        Arc : Arc,
        Point : Point,
        SequenceDraw : SequenceDraw
    }
};