import Physics from "./physics";

export default class BasePhysics{
    target : any;
    afterQueue : Array<Physics> = [];

    constructor(){
    }

    effect() : Promise<any> {
        if (this.afterQueue.length > 0)
        {
            let allPromise : Array<Promise<any>> = [];
            this.afterQueue.forEach((physics)=>{
                allPromise.push(physics.effect());
            });
            return Promise.all(allPromise);
        }
        return new Promise((resolve, reject)=>{
            resolve();
        });
    }

    setTarget(target : any){
        this.target = target;
    }

    pushAfterQueue(physics : Physics){
        this.afterQueue.push(physics);
    }
}