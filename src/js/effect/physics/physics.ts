interface Physics{
    //作用目标
    target : any;
    afterQueue : Array<Physics>;//当前效果执行完后需要执行的队列，存在先后顺序的情况使用

    setTarget(target : any);

    /** 执行影响 */
    effect() : Promise<any>;

    pushAfterQueue(physics : Physics);
}
export default Physics;