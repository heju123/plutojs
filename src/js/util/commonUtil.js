/**
 * Created by heju on 2017/7/14.
 */
let commonUtil = {
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