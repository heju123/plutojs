export default class MPromise {
    constructor() {
        this.promise = new Promise((resolve, reject)=>{
            this.resolveObj = resolve;
            this.rejectObj = reject;
        });
    }

    resolve(data){
        this.resolveObj(data);
    }

    reject(err){
        this.rejectObj(err);
    }

    then(resolve, reject){
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

    finally(resolve){
        this.finallyResolve = resolve;
        return this;
    }
}