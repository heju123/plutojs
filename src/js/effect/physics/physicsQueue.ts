import Component from "../../ui/components/component";
import Physics from "./physics";

/** 物理效果队列 */
export default class PhysicsQueue{
    private component : Component;//当前组件
    private queue : Array<Physics> = [];
    private lastTime : number;
    private executeLock : boolean = false;

    constructor(component){
        this.component = component;
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

                let allPromise : Array<Promise<any>> = [];
                this.queue.forEach((physics)=>{
                    allPromise.push(physics.effect());
                });
                Promise.all(allPromise).then(()=>{
                    this.executeLock = false;
                }, ()=>{
                    this.executeLock = false;
                });

                this.lastTime = currentTime;
            }
        }
    }

    add(physics : Physics){
        this.queue.push(physics);
    }

    getLength() : number{
        return this.queue.length;
    }

    destory(){
        this.queue.forEach((physics)=>{
            physics.destory();
        });
    }
}