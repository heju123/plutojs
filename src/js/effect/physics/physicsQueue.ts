import Physics from "./physics";

/** 物理效果队列 */
export default class PhysicsQueue{
    private self : any;//当前对象
    private queue : Array<Physics> = [];
    private lastTime : number;
    private executeLock : boolean = false;

    constructor(self : any){
        this.self = self;
    }

    effect(){
        if (this.executeLock)
        {
            return;
        }
        let currentTime = (new Date()).getTime();
        if (!this.lastTime)
        {
            this.lastTime = currentTime;
        }
        else
        {
            if (currentTime - this.lastTime >= 1)//大约1毫秒执行一次
            {
                this.executeLock = true;

                this.doEffect().then(()=>{
                    this.executeLock = false;
                }, ()=>{
                    this.executeLock = false;
                });

                this.lastTime = currentTime;
            }
        }
    }

    /** 无间隔立即执行 */
    doEffect() : Promise<any>{
        return new Promise((resolve, reject)=>{
            let allPromise : Array<Promise<any>> = [];
            this.queue.forEach((physics)=>{
                allPromise.push(physics.effect());
            });
            Promise.all(allPromise).then(()=>{
                resolve(undefined);
            }, ()=>{
                reject();
            });
        });
    }

    add(physics : Physics){
        this.queue.push(physics);
    }

    getLength() : number{
        return this.queue.length;
    }

    destroy(){
        this.queue.forEach((physics)=>{
            physics.destroy();
        });
    }
}