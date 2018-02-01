import Physics from "./physics";

export default class BasePhysics{
    target : any;
    beforeQueue : Array<Physics> = [];

    constructor(target : any){
        this.target = target;
    }

    effect() : Promise<any> {
        if (this.beforeQueue.length > 0)
        {
            let allPromise : Array<Promise<any>> = [];
            this.beforeQueue.forEach((physics)=>{
                allPromise.push(physics.effect());
            });
            return Promise.all(allPromise);
        }
        return new Promise((resolve, reject)=>{
            resolve();
        });
    }

    pushBeforeQueue(physics : Physics){
        this.beforeQueue.push(physics);
    }

    destroy(){
        if (this.beforeQueue.length > 0)
        {
            this.beforeQueue.forEach((physics)=>{
                physics.destroy();
            });
        }
    }
}