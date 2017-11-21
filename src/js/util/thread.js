export default class Thread {
    constructor(fun, callback) {
        if(typeof(Worker)!=="undefined")
        {
            let scriptDom = document.createElement("SCRIPT");
            scriptDom.setAttribute("type", "javascript/worker");
            let textDom = document.createTextNode("self.onmessage=" + fun.toString());
            scriptDom.appendChild(textDom);
            let blob = new Blob([scriptDom.text], { type: "text/plain" });
            this.worker = new Worker(window.URL.createObjectURL(blob));

            this.worker.onmessage = (e)=> {
                if (callback && typeof(callback) == "function")
                {
                    callback.apply(this, [e.data]);
                }
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
        this.worker.postMessage(sendData);
    }

    terminate(){
        this.worker.terminate();
    }
}