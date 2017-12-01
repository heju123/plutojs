import Map from "../ui/components/game/map.js";
import MPromise from "../util/promise.js";

/**
 * 盒子模型碰撞检测
 */
export default class BoxCollisionDetector{
    constructor() {
    }

    /**
     * 碰撞检测线程方法
     *
     * @return 0：无碰撞；[]：返回发生碰撞的最小和最大行列数
     */
    thread_detectCollision(e){
        let data = JSON.parse(e.data);
        let mapData = data.mapData;
        let mapColMin = data.mapColMin;
        let mapColMax = data.mapColMax;
        let mapRowMin = data.mapRowMin;
        let mapRowMax = data.mapRowMax;
        let collision = [];//记录所有碰撞的坐标点

        let minRow;//最小碰撞行数
        let minCol;//最小碰撞列数
        let maxRow;//最大碰撞行数
        let maxCol;//最大碰撞列数
        for (let row = mapRowMin; row <= mapRowMax; row++) {
            for (let col = mapColMin; col <= mapColMax; col++) {
                if (mapData[row] && mapData[row][col] && mapData[row][col].block) {
                    minRow = !minRow ? row : Math.min(row, minRow);
                    minCol = !minCol ? col : Math.min(col, minCol);
                    maxRow = !maxRow ? row : Math.max(row, maxRow);
                    maxCol = !maxCol ? col : Math.max(col, maxCol);
                }
            }
        }
        if (minRow && maxRow && minCol && maxCol)
        {
            collision.push(minRow);
            collision.push(maxRow);
            collision.push(minCol);
            collision.push(maxCol);
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
     * @param com 要检测的组件
     * @param sx 要设置的x值
     * @param sy 要设置的y值
     * @param thread 碰撞处理使用的线程
     * @param fixCoor 发生碰撞时是否修复坐标，防止一直卡在障碍内
     * @return reject：发生碰撞；resolve:未发生碰撞
     */
    detectCollision(com, sx, sy, thread, fixCoor)
    {
        let $this = com;
        let promise = new MPromise();
        if (!($this.parent instanceof Map))
        {
            promise.resolve();
            return promise;
        }
        if (sx > $this.parent.getWidth() || sy > $this.parent.getHeight()
            || sx + $this.getWidth() < 0 || sy + $this.getHeight() < 0)//超出map范围不考虑碰撞
        {
            promise.resolve();
            return promise;
        }
        //关键地图数据不存在，可能是地图还没初始化完成
        if ($this.parent.mapSize == 0 || !$this.parent.mapData || $this.parent.mapData.length === 0)
        {
            promise.reject();
            return promise;
        }

        let mapColMin = Math.floor(sx / $this.parent.mapSize);
        let mapColMax = Math.floor((sx + $this.getWidth()) / $this.parent.mapSize);
        if ((sx + $this.getWidth()) % $this.parent.mapSize === 0)
        {
            mapColMax--;
        }
        let mapRowMin = Math.floor(sy / $this.parent.mapSize);
        let mapRowMax = Math.floor((sy + $this.getHeight()) / $this.parent.mapSize);
        if ((sy + $this.getHeight()) % $this.parent.mapSize === 0)
        {
            mapRowMax--;
        }
        thread.run({
            mapColMin : mapColMin,
            mapColMax : mapColMax,
            mapRowMin : mapRowMin,
            mapRowMax : mapRowMax,
            mapData : $this.parent.mapData
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
                    let minRow = collisionsArr[0];
                    let maxRow = collisionsArr[1];
                    let minCol = collisionsArr[2];
                    let maxCol = collisionsArr[3];
                    if (maxRow - minRow > maxCol - minCol)//垂直的碰撞面积更大，应该做横向移动修复坐标
                    {
                        if (mapColMax - minCol > minCol - mapColMin)//碰撞处在左边，应该向右移动
                        {
                            $this.setX(maxCol * $this.parent.mapSize + parseInt($this.parent.mapSize));
                        }
                        else
                        {
                            $this.setX(minCol * $this.parent.mapSize - $this.getWidth());
                        }
                    }
                    else//竖向运动
                    {
                        if (mapRowMax - minRow < minRow - mapRowMin)//碰撞处在下面，应该向上移动
                        {
                            $this.setY(minRow * $this.parent.mapSize - $this.getHeight());
                        }
                        else
                        {
                            $this.setY(maxRow * $this.parent.mapSize + parseInt($this.parent.mapSize));
                        }
                    }
                }
                promise.reject(data);
            }
        });
        return promise;
    }
}