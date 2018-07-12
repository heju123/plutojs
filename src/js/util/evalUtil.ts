let evalUtil : any = {
    /** 解析类似a.b.c的语句 */
    evalDotSyntax : (arg : string, context : any)=>{
        let items = arg.split(".");
        if (items.length === 1)
        {
            return context;
        }
        else
        {
            let currVal : any = "";
            let funInfo;
            items.forEach((item)=>{
                if (item === "this")
                {
                    currVal = context;
                }
                else
                {
                    funInfo = evalUtil.evalFunction(item, currVal);
                    if (typeof(currVal[funInfo.name]) === "function")
                    {
                        currVal = currVal[funInfo.name].apply(currVal, funInfo.params);
                    }
                    else
                    {
                        currVal = currVal[funInfo.name];
                    }
                }
            });
            return currVal;
        }
    },
    /** 解析参数 */
    evalArg : (arg : string, context : any)=>{
        if (!arg)
        {
            return "";
        }
        arg = arg.replace(/(^\s*)|(\s*$)/g, "");//去掉前后空格
        if (/^\'.*\'$/.test(arg))//字符串
        {
            return arg.replace(/\'/g, "");
        }
        else if (arg.split(".").length > 1)//类似a.b.c的语句
        {
            return evalUtil.evalDotSyntax(arg, context);
        }
        return arg;//其他如数字类型
    },
    /** 解析如function1(arg1,'arg2',this.getWidth())这种字符串 */
    evalFunction : (funStr : string, context : any)=>{
        let paramIndex = funStr.indexOf("(");
        let params = [];
        let funName;
        if (paramIndex > -1)//带括号
        {
            funName = funStr.substring(0, paramIndex);
            let argsStrMatch = funStr.match(/\(.*\)/);
            if (argsStrMatch && argsStrMatch.length > 0)
            {
                if (argsStrMatch[0] !== "()")
                {
                    let argsStr = argsStrMatch[0].substring(1, argsStrMatch[0].length - 1);
                    let args = argsStr.split(",");
                    args.forEach((arg)=>{
                        params.push(evalUtil.evalArg(arg, context));
                    });
                }
            }
        }
        else
        {
            funName = funStr;
        }
        return {
            name : funName,
            params : params
        };
    }
};
export default evalUtil;