import Rect from "../rect.js";
import globalUtil from "../../../util/globalUtil";
import httpUtil from "../../../util/httpUtil.js";
import commonUtil from "../../../util/commonUtil";

export default class Map extends Rect {
    constructor(parent) {
        super(parent);

        this.mapWidth = 0;
        this.mapHeight = 0;
        this.mapSize = 0;
    }

    initCfg(cfg){
        let promise = super.initCfg(cfg);

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
                if (!this.mapData)//cfg无mapData信息，则初始化默认地图数据
                {
                    this.initMapData();
                }
                else
                {
                    this.initWH();
                    this.onMapDataChanged();
                }
            });
        }
        this.terrainPolicy = cfg.terrainPolicy;
        return promise;
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

    onMapDataChanged(){
        if (this.terrainPolicy && this.mapData)
        {
            this.removeAllChildren("map_data");
            let rect;
            let style;
            for (let y = 0; y < this.mapData.length; y++)
            {
                for (let x = 0; x < this.mapData[y].length; x++)
                {
                    if (this.mapData[x][y].block || this.mapData[x][y].terrain !== 0)
                    {
                        rect = new Rect(this);
                        rect.name = "map_data";
                        style = {
                            x: x * this.mapSize,
                            y: y * this.mapSize,
                            width: this.mapSize,
                            height: this.mapSize
                        };
                        if (this.mapData[x][y].block && this.terrainPolicy.block)
                        {
                            commonUtil.copyObject(this.terrainPolicy.block, style, true);
                        }
                        if (this.mapData[x][y].terrain !== 0)
                        {
                            commonUtil.copyObject(this.terrainPolicy[this.mapData[x][y].terrain], style, true);
                        }
                        rect.setStyle(style);
                        this.appendChildren(rect);
                    }
                }
            }
        }
    }
}