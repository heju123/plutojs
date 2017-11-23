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

        this.detectCollisionThread = new Thread(this.thread_detectCollision);
        this.detectXCollisionThread = new Thread(this.thread_detectCollision);
        this.detectYCollisionThread = new Thread(this.thread_detectCollision);
    }

    initCfg(cfg){
        let promise = super.initCfg(cfg);
        return promise;
    }

    thread_detectCollision(e){
        let data = JSON.parse(e.data);
        let mapData = data.mapCom.mapData;
        let mapColMin = data.mapColMin;
        let mapColMax = data.mapColMax;
        let mapRowMin = data.mapRowMin;
        let mapRowMax = data.mapRowMax;
        let collision = [];//记录所有碰撞的坐标点
        for (let row = mapRowMin; row <= mapRowMax; row++) {
            for (let col = mapColMin; col <= mapColMax; col++) {
                if (mapData[row] && mapData[row][col] && mapData[row][col].block) {
                    collision.push(row);
                    collision.push(col);
                }
            }
        }

        if (collision.length > 0)
        {
            self.postMessage(JSON.stringify(collision));
        }
        else
        {
            self.postMessage(0);
        }
    }

    /**
     * 碰撞检测，必须this.parent是Map对象才行
     *
     * @param sx 要设置的x值
     * @param sy 要设置的y值
     * @param thread 碰撞处理使用的线程
     * @param fixCoor 发生碰撞时是否修复坐标，防止一直卡在障碍内
     * @return reject：发生碰撞；resolve:未发生碰撞
     */
    detectCollision(sx, sy, thread, fixCoor)
    {
        let promise = new MPromise();
        if (!(this.parent instanceof Map))
        {
            promise.resolve();
            return promise;
        }
        if (sx > this.parent.getWidth() || sy > this.parent.getHeight()
            || sx + this.getWidth() < 0 || sy + this.getHeight() < 0)//超出map范围不考虑碰撞
        {
            promise.resolve();
            return promise;
        }
        //关键地图数据不存在，可能是地图还没初始化完成
        if (this.parent.mapSize == 0 || !this.parent.mapData || this.parent.mapData.length === 0)
        {
            promise.reject();
            return promise;
        }

        let mapColMin = Math.floor(sx / this.parent.mapSize);
        let mapColMax = Math.floor((sx + this.getWidth()) / this.parent.mapSize);
        if ((sx + this.getWidth()) % this.parent.mapSize === 0)
        {
            mapColMax--;
        }
        let mapRowMin = Math.floor(sy / this.parent.mapSize);
        let mapRowMax = Math.floor((sy + this.getHeight()) / this.parent.mapSize);
        if ((sy + this.getHeight()) % this.parent.mapSize === 0)
        {
            mapRowMax--;
        }
        thread.run({
            mapColMin : mapColMin,
            mapColMax : mapColMax,
            mapRowMin : mapRowMin,
            mapRowMax : mapRowMax,
            mapCom : this.parent
        },function(key, value) {
            if (key === 'parent' || key === 'controller') {
                return undefined;
            }
            return value;
        }).then((data)=>{
            if (typeof(data) === "number" && data === 0)//无碰撞
            {
                promise.resolve();
            }
            else
            {
                //修复坐标
                if (fixCoor)
                {
                    let collisionsArr = JSON.parse(data);
                    let minRow;
                    let minCol;
                    let maxRow;
                    let maxCol;
                    for (let i = 0, j = collisionsArr.length; i < j; i += 2)
                    {
                        minRow = !minRow ? collisionsArr[i] : Math.min(collisionsArr[i], minRow);
                        minCol = !minCol ? collisionsArr[i + 1] : Math.min(collisionsArr[i + 1], minCol);
                        maxRow = !maxRow ? collisionsArr[i] : Math.max(collisionsArr[i], maxRow);
                        maxCol = !maxCol ? collisionsArr[i + 1] : Math.max(collisionsArr[i + 1], maxCol);
                    }
                    if (maxRow - minRow > maxCol - minCol)//垂直的碰撞面积更大，应该做横向移动修复坐标
                    {
                        if (mapColMax - minCol > minCol - mapColMin)//碰撞处在左边，应该向右移动
                        {
                            this.setX(maxCol * this.parent.mapSize + this.parent.mapSize);
                        }
                        else
                        {
                            this.setX(minCol * this.parent.mapSize - this.getWidth());
                        }
                    }
                    else//竖向运动
                    {
                        if (mapRowMax - minRow < minRow - mapRowMin)//碰撞处在下面，应该向上移动
                        {
                            this.setY(minRow * this.parent.mapSize - this.getHeight());
                        }
                        else
                        {
                            this.setY(maxRow * this.parent.mapSize + this.parent.mapSize);
                        }
                    }
                }
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
            if (currentTime - this.lastTime >= 1)//大约1毫秒执行一次
            {
                if (this.xAcceleration !== 0)
                {
                    this.xSpeed = this.xSpeed + this.xAcceleration;
                }
                if (this.yAcceleration !== 0)
                {
                    this.ySpeed = this.ySpeed + this.yAcceleration;
                }

                if ((this.xSpeed !== 0 || this.ySpeed !== 0) && !this.detectCollisionLock)
                {
                    //先判断当前是否在障碍中
                    this.detectCollisionLock = true;
                    this.detectCollision(this.getX(), this.getY(), this.detectCollisionThread, true).then(()=>{
                    }, ()=>{
                    }).finally(()=>{
                        this.detectCollision(this.getX() + this.xSpeed, this.getY() + this.ySpeed, this.detectCollisionThread).then(()=>{
                            this.setStyle("x", this.getX() + this.xSpeed);
                            this.setStyle("y", this.getY() + this.ySpeed);
                            this.detectCollisionLock = false;
                        }, ()=>{
                            let promise = new MPromise();

                            //x或y方向发生碰撞，则只移动x或y
                            this.detectCollision(this.getX() + this.xSpeed, this.getY(), this.detectXCollisionThread).then(()=>{
                                this.setStyle("x", this.getX() + this.xSpeed);
                            }, ()=>{
                                this.xSpeed = 0;
                            }).finally(()=>{
                                promise.resolve();
                            });
                            this.detectCollision(this.getX(), this.getY() + this.ySpeed, this.detectYCollisionThread).then(()=>{
                                this.setStyle("y", this.getY() + this.ySpeed);
                            }, ()=>{
                                this.ySpeed = 0;
                            }).finally(()=>{
                                promise.resolve();
                            });

                            promise.then(()=>{
                                this.detectCollisionLock = false;
                            });
                        });
                    });
                }
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
        if (this.detectXCollisionThread)
        {
            this.detectXCollisionThread.terminate();
        }
        if (this.detectYCollisionThread)
        {
            this.detectYCollisionThread.terminate();
        }
    }
}