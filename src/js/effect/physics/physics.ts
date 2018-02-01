interface Physics{
    //作用目标
    target : any;
    beforeQueue : Array<Physics>;//执行当前效果之前执行的队列，如果reject，则不执行当前效果

    /** 执行影响 */
    effect() : Promise<any>;

    pushBeforeQueue(physics : Physics);

    destroy();
}
export default Physics;