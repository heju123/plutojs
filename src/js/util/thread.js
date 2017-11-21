import MPromise from "./promise.js";

export default class Thread {
    constructor(fun) {
        if(typeof(Worker)!=="undefined")
        {
            this.callbackPromises = [];
            let scriptDom = document.createElement("SCRIPT");
            scriptDom.setAttribute("type", "javascript/worker");
            let textDom = document.createTextNode("self.onmessage=" + fun.toString());
            scriptDom.appendChild(textDom);
            let blob = new Blob([scriptDom.text], { type: "text/plain" });
            this.worker = new Worker(window.URL.createObjectURL(blob));

            this.worker.onmessage = (e)=> {
                this.doCallbacks(e);
            };
        }
    }

    /**
     * 发送数据到线程处理
     *
     * @param data 发送的数据
     * @param replacer function对象，作为JSON.stringify的过滤器
     */
    postMessage(data, replacer){
        let sendData;
        if (typeof(data) == "object")
        {
            sendData = JSON.stringify(data, replacer);
        }
        else
        {
            sendData = data;
        }
        let callbackPromise = new MPromise();
        this.callbackPromises.push(callbackPromise);
        this.worker.postMessage(sendData);
        return callbackPromise;
    }

    doCallbacks(e){
        if (this.callbackPromises.length > 0)
        {
            this.callbackPromises.forEach((promise)=>{
                promise.resolve(e.data);
            });
            this.callbackPromises.length = 0;
        }
    }

    terminate(){
        this.worker.terminate();
    }
}