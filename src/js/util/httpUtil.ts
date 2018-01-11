/**
 * Created by heju on 2017/2/10.
 */
let httpUtil : any = {
    getGetParamStr : (param : any) => {
        let str = "";
        if (param != undefined)
        {
            for (let key in param)
            {
                str += key + "=" + param[key] + "&";
            }
            str = str.substring(0, str.length - 1);
        }
        return str;
    },
    get : (url : string, param : any) => {
        return new Promise((resolve, reject)=>{
            let purl = url;
            if (param)
            {
                purl = url + "?" + httpUtil.getGetParamStr(param);
            }
            let xmlhttp;
            if ((<any>window).XMLHttpRequest)
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
    post : (url : string, param : any) => {
        return new Promise((resolve, reject)=>{
            let xmlhttp;
            if ((<any>window).XMLHttpRequest)
            {
                //  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
                xmlhttp=new XMLHttpRequest();
            }
            else
            {
                // IE6, IE5 浏览器执行代码
                xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
            }
            xmlhttp.open('post',url,true);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            param = httpUtil.getGetParamStr(param);
            xmlhttp.send(param);
            xmlhttp.onreadystatechange = function(){
                //当状态为4的时候，执行以下操作
                if(xmlhttp.readyState==4 && xmlhttp.status==200){
                    resolve(xmlhttp.response);
                }
            };
        });
    }
};
export default httpUtil;