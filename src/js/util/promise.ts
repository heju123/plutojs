export default class MPromise {
    promise : Promise<any>;
    finallyResolve : Function;
    resolveObj : Function;
    rejectObj : Function;

    constructor() {
        this.promise = new Promise((resolve, reject)=>{
            this.resolveObj = resolve;
            this.rejectObj = reject;
        });
    }

    resolve(data? : any){
        this.resolveObj(data);
    }

    reject(err? : any){
        this.rejectObj(err);
    }

    then(resolve? : Function, reject? : Function){
        this.promise.then((data)=>{
            resolve(data);
            if (this.finallyResolve && typeof(this.finallyResolve) === "function")
            {
                this.finallyResolve();
            }
        }, (err)=>{
            reject(err);
            if (this.finallyResolve && typeof(this.finallyResolve) === "function")
            {
                this.finallyResolve();
            }
        });
        return this;
    }

    finally(resolve? : Function){
        this.finallyResolve = resolve;
        return this;
    }
}