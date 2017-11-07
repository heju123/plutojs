import Rect from "../rect.js";
import globalUtil from "../../../util/globalUtil";
import httpUtil from "../../../util/httpUtil.js";

export default class Map extends Rect {
    constructor(parent) {
        super(parent);

        this.mapWidth = 0;
        this.mapHeight = 0;
        this.mapSize = 0;
    }

    initCfg(cfg){
        super.initCfg(cfg);

        if (cfg.mapDataUrl)
        {
            httpUtil.get(cfg.mapDataUrl).then((data)=>{
                if (data)
                {
                    data = JSON.parse(data);
                    if (data.mapData)
                    {
                        data.mapData = JSON.parse(data.mapData);
                    }
                }
                this.mapWidth = data.width;
                this.mapHeight = data.height;
                this.mapSize = data.size;
                this.mapData = data.mapData;
                if (!this.mapData)
                {
                    this.initMapData();
                }
                else
                {
                    this.initWH();
                }
            });
        }
    }

    //初始化地图数据
    initMapData(){
        this.mapData = [];
        for (let i = 0; i < this.mapWidth; i++)
        {
            this.mapData[i] = [];
            for (let j = 0; j < this.mapHeight; j++)
            {
                this.mapData[i][j] = {
                    block : false,//是否障碍物
                    terrain : 0//地形：无
                };
            }
        }
        this.initWH();
    }

    /** 初始化地图高宽 */
    initWH(){
        this.setStyle("width", this.mapWidth * this.mapSize);
        this.setStyle("height", this.mapHeight * this.mapSize);
    }

    draw(ctx) {
        if (!super.draw(ctx)) {
            return false;
        }

        ctx.save();
        this.setCommonStyle(ctx);
        this.setClip(ctx);
        ctx.beginPath();

        for (let i = 0; i < this.mapData.length; i++)
        {
            for (let j = 0; j < this.mapData[i].length; j++)
            {
            }
        }

        ctx.closePath();
        ctx.restore();
        return true;
    }
}