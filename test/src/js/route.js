/**
 * Created by heju on 2017/7/27.
 */
import {commonUtil} from "~/js/main";

let output = {
    id : "mainRoute",
    type : "route",
    routes : {}
};

commonUtil.copyObject(require("./index/route").default, output.routes, false);
export default output;