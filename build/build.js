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
    SequenceDraw,
    QuadraticCurve,
    BezierCurve,
    Acceleration,
    Collision,
    Friction,
    Physics,
    PhysicsQueue,
    Speed,
    BaseParticle,
    Particle,
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
        Path,
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
        Physics,
        PhysicsQueue,
        Speed
    },
    data : {
        Stack,
        LinkedItem,
        LinkedList
    },
    particle : {
        BaseParticle,
        Particle
    },
    cache : {
        Cache
    }
};