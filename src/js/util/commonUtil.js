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
     * @param deep 是否深度复制
     * @return 复制的目标对象
     */
    copyObject : (obj, dest, override, deep)=>{
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
                if (deep && typeof(obj[key]) === "object" && !(obj[key] instanceof Array))
                {
                    result[key] = commonUtil.copyObject(obj[key], undefined, override, deep);
                }
                else if (deep && typeof(obj[key]) === "object" && obj[key] instanceof Array)
                {
                    result[key] = commonUtil.copyArray(obj[key], undefined, deep);
                }
                else
                {
                    result[key] = obj[key];
                }
            }
        }
        return result;
    },
    /**
     * 复制数组
     * @param obj 待复制的数组
     * @param dest 复制到目标数组
     * @param deep 是否深度复制
     * @return 复制的目标对象
     */
    copyArray : (obj, dest, deep)=>{
        let result = dest || [];
        obj.forEach((item)=>{
            if (deep && typeof(item) === "object" && !(item instanceof Array))
            {
                result.push(commonUtil.copyObject(item, undefined, true, deep));
            }
            else if (deep && typeof(item) === "object" && item instanceof Array)
            {
                result.push(commonUtil.copyArray(item, undefined, deep));
            }
            else
            {
                result.push(item);
            }
        });
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
            if (item[key] === value)
            {
                return item;
            }
        }
        return undefined;
    },
    /**
     * 判断对象是否在数组中
     * @param arr
     * @param object
     */
    inArray : (arr, object)=>{
        if (arr == undefined || object == undefined)
        {
            return false;
        }
        let item;
        for (let i = 0,j = arr.length; i < j; i++)
        {
            item = arr[i];
            if (item === object)
            {
                return true;
            }
        }
        return false;
    },
    /** 根据后缀获取时间(单位：秒) */
    getTimeSecForSuffix : (time)=>{
        if (time.toString().lastIndexOf("ms") > -1)
        {
            time = time.substring(0, time.lastIndexOf("ms"));
            time = parseFloat(time) / 1000;
        }
        else if (time.toString().lastIndexOf("s") > -1)
        {
            time = time.substring(0, time.lastIndexOf("s"));
            time = parseFloat(time);
        }
        return time;
    },
    /**
     * 删除多余属性
     *
     * @param obj 要删除属性的对象
     * @param compareObj 比较的对象，如果obj中的某属性在compareObj对象中不存在，则删除
     * @param ignoreAttrs 这些属性除外，传入字符串，逗号分割
     */
    removeExtraAttr : (obj, compareObj, ignoreAttrs)=>{
        for (let key in obj)
        {
            if (ignoreAttrs.indexOf(key) > -1)
            {
                continue;
            }
            if (!compareObj.hasOwnProperty(key))
            {
                delete obj[key];
            }
        }
    },
    /**
     * 弹出提示框
     *
     * @param msg
     */
    popMessageTooltip : (msg, opts)=>{
        alert(msg);
    },
    /**
     * 创建图片dom
     */
    createImageDom : (url)=>{
        return new Promise((resolve, reject)=>{
            let img = new Image();
            img.onload = function(){
                resolve(this);
            };
            img.src = url;
        });
    }
};
export default commonUtil;