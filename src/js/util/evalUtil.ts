let evalUtil : any = {
    /** 解析类似a.b.c的语句 */
    evalDotSyntax : (arg : string, context : any)=>{
        //正则表达式按圆点分割，如：'this.aaa.getWidth().getHeight(\'321\',\"123\").getComponent2$_ByName(this.name_21, this.aabb)'
        let itemsMatch = arg.match(/(\w|\$|(\((\w|\s|\.|\$|\,|\"|\')*\)))+/g);
        if (itemsMatch.length === 1)
        {
            return arg;
        }
        else
        {
            let currVal : any = "";
            let funInfo;
            itemsMatch.forEach((item)=>{
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
        else if (/\./.test(arg))//类似a.b.c的语句
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

                    //正则表达式按逗号分割参数，如：'this.getComponent2$_ByName(this.name_21, this.aabb), \"aaa\", this.getWidth(\'111\', 222, \"333\"), this.getHeight()'
                    let argsMatch = argsStr.match(/(\w|\s|\.|\$|\"|\'|(\((\w|\s|\.|\$|\,|\"|\')*\)))+/g);
                    argsMatch.forEach((arg)=>{
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