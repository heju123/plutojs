/**
 * Created by heju on 2017/2/10.
 */
let httpUtil = {
    getGetParamStr : (param, normal) => {
        let str = "";
        if (param != undefined)
        {
            for (let key in param)
            {
                if (normal)
                {
                    str += key + "=" + param[key] + "&";
                }
                else
                {
                    str += "/" + param[key];
                }
            }
            if (normal)
            {
                str = str.substring(0, str.length - 1);
            }
        }
        return str;
    },
    get : (url, param) => {
        return new Promise((resolve, reject)=>{
            let purl = url;
            if (param)
            {
                purl = url + httpUtil.getGetParamStr(param);
            }
            let xmlhttp;
            if (window.XMLHttpRequest)
            {
                //  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
                xmlhttp=new XMLHttpRequest();
            }
            else
            {
                // IE6, IE5 浏览器执行代码
                xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
            }
            xmlhttp.onreadystatechange = function()
            {
                if (xmlhttp.readyState==4 && xmlhttp.status==200)
                {
                    resolve(xmlhttp.response);
                }
            }
            xmlhttp.open("GET",purl,true);
            xmlhttp.send();
        });
    },
    post : (url, param, callback, errCallback) => {
        $.ajax({
            type : "post",
            contentType: 'application/json',
            data :  JSON.stringify(param),
            url : url,
            success : function(data, textStatus, jqXHR){
                if (callback && typeof(callback) == "function")
                {
                    callback.apply(this, [data]);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (errCallback && typeof(errCallback) == "function")
                {
                    errCallback.apply(this, [textStatus]);
                }
            }
        });
    }
};
export default httpUtil;