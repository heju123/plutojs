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
    Arc,
    Point,
    SequenceDraw,
    QuadraticCurve,
    BezierCurve,
    Acceleration,
    Collision,
    Friction,
    PhysicsQueue,
    Speed,
    BaseParticle,
    Stack,
    LinkedItem,
    LinkedList,
    Cache
} from "~/js/main";

window.plutojs = {
    Main,
    Controller,
    utils : {
        Thread,
        MPromise,
        commonUtil,
        httpUtil,
        animationUtil
    },
    components : {
        Component,
        Sprite,
        Router,
        Button,
        Checkbox,
        Input,
        Rect,
        Scrollbar
    },
    draw : {
        ArcPath,
        PointPath,
        Arc,
        Point,
        SequenceDraw,
        QuadraticCurve,
        BezierCurve
    },
    physics : {
        Acceleration,
        Collision,
        Friction,
        PhysicsQueue,
        Speed
    },
    data : {
        Stack,
        LinkedItem,
        LinkedList
    },
    particle : {
        BaseParticle
    },
    cache : {
        Cache
    }
};