import Rect from "../rect.js";

export default class Sprite extends Rect {
    constructor(parent) {
        super(parent);

        this.xSpeed = 0;//大约一毫秒移动的x距离
        this.ySpeed = 0;//大约一毫秒移动的y距离

        this.setStyle("zIndex", 1000);
    }

    initCfg(cfg){
        super.initCfg(cfg);
    }

    draw(ctx) {
        if (!super.draw(ctx)) {
            return false;
        }
        if (this.xSpeed !== 0 || this.ySpeed !== 0)
        {
            let currentTime = (new Date()).getTime();
            if (!this.lastTime)
            {
                this.lastTime = currentTime;
            }
            else
            {
                if (currentTime - this.lastTime >= 1)
                {
                    this.setStyle("x", this.getX() + this.xSpeed);
                    this.setStyle("y", this.getY() + this.ySpeed);

                    this.lastTime = currentTime;
                }
            }
        }
        return true;
    }
}