import Rect from "../rect.js";
import Map from "../game/map.js";
import Thread from "../../../util/thread.js";
import MPromise from "../../../util/promise.js";

export default class Sprite extends Rect {
    constructor(parent) {
        super(parent);

        this.xSpeed = 0;//大约一毫秒移动的x距离
        this.ySpeed = 0;//大约一毫秒移动的y距离
        this.xAcceleration = 0;//x加速度，大约一毫秒增加或减小的速度值
        this.yAcceleration = 0;//y加速度

        this.setStyle("zIndex", 1000);

        this.detectCollisionThread = new Thread(this.detectCollisionByThread);
    }

    initCfg(cfg){
        let promise = super.initCfg(cfg);
        return promise;
    }

    detectCollisionByThread(e){
        let data = JSON.parse(e.data);
        let sx = data.sx;
        let sy = data.sy;
        let sWidth = data.sWidth;
        let sHeight = data.sHeight;
        let mapSize = data.mapSize;
        let mapData = data.mapData;

        let mapXMin = Math.floor(sx / mapSize);
        let mapXMax = Math.floor((sx + sWidth) / mapSize);
        let mapYMin = Math.floor(sy / mapSize);
        let mapYMax = Math.floor((sy + sHeight) / mapSize);
        let collision = false;
        for (let x = mapXMin; x <= mapXMax; x++) {
            for (let y = mapYMin; y <= mapYMax; y++) {
                if (mapData[x] && mapData[x][y] && mapData[x][y].block) {
                    collision = true;
                }
            }
        }

        if (collision)
        {
            self.postMessage("0");
        }
        else
        {
            self.postMessage("1");
        }
    }

    /**
     * 碰撞检测，必须this.parent是Map对象才行
     *
     * @param sx 要设置的x值
     * @param sy 要设置的y值
     * @return reject：发生碰撞；resolve:未发生碰撞
     */
    detectCollision(sx, sy)
    {
        let promise = new MPromise();
        if (!(this.parent instanceof Map))
        {
            promise.resolve();
        }
        if (sx > this.parent.getWidth() || sy > this.parent.getHeight()
            || sx + this.getWidth() < 0 || sy + this.getHeight() < 0)//超出map范围不考虑碰撞
        {
            promise.resolve();
        }

        this.detectCollisionThread.postMessage({
            sx : sx,
            sy : sy,
            sWidth : this.getWidth(),
            sHeight : this.getHeight(),
            mapSize : this.parent.mapSize,
            mapData : this.parent.mapData
        }).then((data)=>{
            if (data === "1")//无碰撞
            {
                promise.resolve();
            }
            else
            {
                promise.reject();
            }
        });
        return promise;
    }

    draw(ctx) {
        let currentTime = (new Date()).getTime();
        if (!this.lastTime)
        {
            this.lastTime = currentTime;
        }
        else
        {
            if (currentTime - this.lastTime >= 1 && !this.detectCollisionLock)//大约1毫秒执行一次
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
                    this.detectCollision(this.getX() + this.xSpeed, this.getY() + this.ySpeed).then(()=>{
                        this.setStyle("x", this.getX() + this.xSpeed);
                        this.setStyle("y", this.getY() + this.ySpeed);
                        this.detectCollisionLock = false;
                    }, ()=>{
                        //x或y方向发生碰撞，则只移动x或y
                        this.detectCollision(this.getX() + this.xSpeed, this.getY()).then(()=>{
                            this.setStyle("x", this.getX() + this.xSpeed);
                            console.log("x speed");
                        }, ()=>{
                            this.xSpeed = 0;
                            console.log("x error");
                        }).finally(()=>{
                            this.detectCollisionLock = false;
                        });
                        this.detectCollision(this.getX(), this.getY() + this.ySpeed).then(()=>{
                            this.setStyle("y", this.getY() + this.ySpeed);
                            console.log("y speed");
                        }, ()=>{
                            this.ySpeed = 0;
                            console.log("y error");
                        }).finally(()=>{
                            this.detectCollisionLock = false;
                        });
                    });
                }
                this.detectCollisionLock = true;
                this.lastTime = currentTime;
            }
        }
        if (!super.draw(ctx)) {
            return false;
        }
        return true;
    }

    destroy(){
        super.destroy();

        if (this.detectCollisionThread)
        {
            this.detectCollisionThread.terminate();
        }
    }
}