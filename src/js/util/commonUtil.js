/**
 * Created by heju on 2017/7/14.
 */
let commonUtil = {
    asyncLoadedScripts: {},
    asyncLoadedScriptsCallbackQueue: {},
    getScriptDomFromUrl : (url)=>{
        let dom;
        if (/.+\.js$/.test(url))
        {
            dom = document.createElement("SCRIPT");
            dom.setAttribute("type", "text/javascript");
            dom.setAttribute("src", url);
        }
        else if(/.+\.css$/.test(url))
        {
            dom = document.createElement('link');
            dom.href = url;
            dom.type = "text/css";
            dom.rel="stylesheet";
        }
        return dom;
    },
    /**
     * 异步加载script或css
     */
    asyncLoadScript: (url, callback) => {
        let $this = commonUtil;
        if ($this.asyncLoadedScripts[url] != undefined)//已加载script标签
        {
            if (callback && typeof(callback) == "function") {
                if ($this.asyncLoadedScripts[url] == 0)//未执行首个script标签的回调
                {
                    if (!$this.asyncLoadedScriptsCallbackQueue[url]) {
                        $this.asyncLoadedScriptsCallbackQueue[url] = [];
                    }
                    $this.asyncLoadedScriptsCallbackQueue[url].push(callback);
                }
                else {
                    callback.apply($this, []);
                }
            }
            return;
        }
        $this.asyncLoadedScripts[url] = 0;
        let scriptDom = $this.getScriptDomFromUrl(url);
        if (scriptDom.readyState) {
            scriptDom.onreadystatechange = function () {
                if (scriptDom.readyState == "loaded" || scriptDom.readyState == "complete") {
                    scriptDom.onreadystatechange = null;
                    $this.asyncLoadedScripts[url] = 1;
                    if (callback && typeof(callback) == "function") {
                        callback.apply($this, []);
                    }
                    if ($this.asyncLoadedScriptsCallbackQueue[url]) {
                        for (let i = 0, j = $this.asyncLoadedScriptsCallbackQueue[url].length; i < j; i++) {
                            $this.asyncLoadedScriptsCallbackQueue[url][i].apply($this, []);
                        }
                        $this.asyncLoadedScriptsCallbackQueue[url] = undefined;
                    }
                }
            }
        }
        else {
            scriptDom.onload = function () {
                $this.asyncLoadedScripts[url] = 1;
                if (callback && typeof(callback) == "function") {
                    callback.apply($this, []);
                }
                if ($this.asyncLoadedScriptsCallbackQueue[url]) {
                    for (let i = 0, j = $this.asyncLoadedScriptsCallbackQueue[url].length; i < j; i++) {
                        $this.asyncLoadedScriptsCallbackQueue[url][i].apply($this, []);
                    }
                    $this.asyncLoadedScriptsCallbackQueue[url] = undefined;
                }
            }
        }
        document.getElementsByTagName('head')[0].appendChild(scriptDom);
    },
    concatList : (list, addList)=>{
        addList.forEach((item)=>{
            list.push(item);
        });
    },
    isEmptyObj : (obj)=>{
        for (let key in obj)
        {
            return false;
        }
        return true;
    },
    /**
     * 复制对象
     * @param obj 待复制的对象
     * @param dest 复制到目标对象
     * @param override 是否覆盖属性，false:如果dest存在相同不为空的属性，则不做复制操作，true:只复制obj不为空的属性
     * @return 复制的目标对象
     */
    copyObject : (obj, dest, override)=>{
        if (override == undefined)
        {
            override = true;
        }
        let result = dest || {};
        for (let key in obj)
        {
            if (!override && result[key])
            {
                continue;
            }
            else
            {
                if (!obj[key] && obj[key] != 0)
                {
                    continue;
                }
                result[key] = obj[key];
            }
        }
        return result;
    },
    copyArray : (obj)=>{
        let result = [];
        for (let i = 0, j = obj.length; i < j; i++)
        {
            if (typeof(obj[i]) == "object")
            {
                result[i] = commonUtil.copyObject(obj[i]);
            }
            else
            {
                result[i] = obj[i];
            }
        }
        return result;
    },
    /**
     * 用key值获取数组
     * @param arr 数组
     * @param key 字段名
     * @param value key字段值
     * @return 数组信息
     */
    getArrayInfoByKey : (arr, key, value)=>{
        let item;
        for (let i = 0, j = arr.length; i < j; i++)
        {
            item = arr[i];
            if (item[key] == value)
            {
                return item;
            }
        }
        return undefined;
    }
};
export default commonUtil;