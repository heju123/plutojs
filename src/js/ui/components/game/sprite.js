import Rect from "../rect.js";
import Map from "../game/map.js";

export default class Sprite extends Rect {
    constructor(parent) {
        super(parent);

        this.xSpeed = 0;//大约一毫秒移动的x距离
        this.ySpeed = 0;//大约一毫秒移动的y距离
        this.xAcceleration = 0;//x加速度，大约一毫秒增加或减小的速度值
        this.yAcceleration = 0.05;//y加速度

        this.setStyle("zIndex", 1000);
    }

    initCfg(cfg){
        super.initCfg(cfg);
    }

    /**
     * 碰撞检测，必须this.parent是Map对象才行
     *
     * @param sx 要设置的x值
     * @param sy 要设置的y值
     * @return true：发生碰撞；false:未发生碰撞
     */
    detectCollision(sx, sy){
        if (!(this.parent instanceof Map))
        {
            return false;
        }
        let mapXMin = Math.floor(sx / this.parent.mapSize);
        let mapXMax = Math.floor((sx + this.getWidth()) / this.parent.mapSize);
        let mapYMin = Math.floor(sy / this.parent.mapSize);
        let mapYMax = Math.floor((sy + this.getHeight()) / this.parent.mapSize);
        let collision = false;
        for (let x = mapXMin; x <= mapXMax; x++) {
            for (let y = mapYMin; y <= mapYMax; y++) {
                if (this.parent.mapData[x] && this.parent.mapData[x][y] && this.parent.mapData[x][y].block) {
                    collision = true;
                }
            }
        }
        return collision;
    }

    draw(ctx) {
        if (!super.draw(ctx)) {
            return false;
        }
        let currentTime = (new Date()).getTime();
        if (!this.lastTime)
        {
            this.lastTime = currentTime;
        }
        else
        {
            if (currentTime - this.lastTime >= 1)
            {
                if (this.xAcceleration !== 0)
                {
                    this.xSpeed = this.xSpeed + this.xAcceleration;
                }
                if (this.yAcceleration !== 0)
                {
                    this.ySpeed = this.ySpeed + this.yAcceleration;
                }

                if (this.xSpeed !== 0 || this.ySpeed !== 0)
                {
                    if (!this.detectCollision(this.getX() + this.xSpeed, this.getY() + this.ySpeed))
                    {
                        this.setStyle("x", this.getX() + this.xSpeed);
                        this.setStyle("y", this.getY() + this.ySpeed);
                    }
                    else
                    {
                        if (!this.detectCollision(this.getX() + this.xSpeed, this.getY()))
                        {
                            this.setStyle("x", this.getX() + this.xSpeed);
                        }
                        else
                        {
                            this.xSpeed = 0;
                        }
                        if (!this.detectCollision(this.getX(), this.getY() + this.ySpeed))
                        {
                            this.setStyle("y", this.getY() + this.ySpeed);
                        }
                        else
                        {
                            this.ySpeed = 0;
                        }
                    }
                }

                this.lastTime = currentTime;
            }
        }
        return true;
    }
}