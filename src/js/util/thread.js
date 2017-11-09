export default class Thread {
    constructor(fun) {
        if(typeof(Worker)!=="undefined")
        {
            let scriptDom = document.createElement("SCRIPT");
            scriptDom.setAttribute("type", "javascript/worker");
            let textDom = document.createTextNode("self.onmessage=" + fun.toString());
            scriptDom.appendChild(textDom);
            let blob = new Blob([scriptDom.text], { type: "text/plain" });
            this.worker = new Worker(window.URL.createObjectURL(blob));
        }
    }

    /**
     * 启动线程
     *
     * @param data 发送的数据
     * @param replacer function对象，作为JSON.stringify的过滤器
     * @param callback 执行结果回调，参数：data
     */
    run(data, replacer, callback){
        this.worker.onmessage = (e)=> {
            if (callback && typeof(callback) == "function")
            {
                callback.apply(this, [e.data]);
            }
        };
        let sendData;
        if (typeof(data) == "object")
        {
            sendData = JSON.stringify(data, replacer);
        }
        else
        {
            sendData = data;
        }
        this.worker.postMessage(sendData);
    }

    terminate(){
        this.worker.terminate();
    }
}