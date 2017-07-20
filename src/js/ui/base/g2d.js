/**
 * Created by heju on 2017/7/20.
 */
export default class G2d {
    constructor() {
    }

    //获取显示在界面上真实的x坐标，加上父级坐标
    getRealX(com){
        if (com.parent)
        {
            return com.x + this.getRealX(com.parent);
        }
        else{
            return com.x;
        }
    }
    getRealY(com){
        if (com.parent)
        {
            return com.y + this.getRealY(com.parent);
        }
        else{
            return com.y;
        }
    }
}