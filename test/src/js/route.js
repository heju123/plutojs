/**
 * Created by heju on 2017/7/27.
 */
import {commonUtil} from "~/js/main";

let output = {
    id : "mainRoute",
    type : "route",
    routes : {}
};

commonUtil.copyObject(require("./nav/route").default, output.routes, false);
commonUtil.copyObject(require("./draw/route").default, output.routes, false);
commonUtil.copyObject(require("./input/route").default, output.routes, false);
commonUtil.copyObject(require("./button/route").default, output.routes, false);
commonUtil.copyObject(require("./checkbox/route").default, output.routes, false);
commonUtil.copyObject(require("./main/route").default, output.routes, false);
commonUtil.copyObject(require("./nestRoute/route").default, output.routes, false);
commonUtil.copyObject(require("./scrollbar/route").default, output.routes, false);
commonUtil.copyObject(require("./cliptest/route").default, output.routes, false);
commonUtil.copyObject(require("./particleEffects/route").default, output.routes, false);
export default output;