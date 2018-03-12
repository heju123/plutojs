interface Physics{
    //作用目标
    target : any;
    beforeQueue : Array<Physics>;//执行当前效果之前执行的队列，如果reject，则不执行当前效果
    delay : number;//延迟执行效果，单位：毫秒

    /** 执行影响 */
    effect() : Promise<any>;

    pushBeforeQueue(physics : Physics);

    isDelay() : boolean;//是否正在延迟当中，true：正在延迟

    destroy();
}
export default Physics;