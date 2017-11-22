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
        for (let row = 0; row < this.mapHeight; row++)
        {
            this.mapData[row] = [];
            for (let col = 0; col < this.mapWidth; col++)
            {
                this.mapData[row][col] = {
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
            for (let row = 0; row < this.mapData.length; row++)
            {
                for (let col = 0; col < this.mapData[row].length; col++)
                {
                    if (this.mapData[row][col].block || this.mapData[row][col].terrain !== 0)
                    {
                        rect = new Rect(this);
                        rect.name = "map_data";
                        rect.init();
                        style = {
                            x: col * this.mapSize,
                            y: row * this.mapSize,
                            width: this.mapSize,
                            height: this.mapSize
                        };
                        if (this.mapData[row][col].block && this.terrainPolicy.block)
                        {
                            commonUtil.copyObject(this.terrainPolicy.block, style, true);
                        }
                        if (this.mapData[row][col].terrain !== 0)
                        {
                            commonUtil.copyObject(this.terrainPolicy[this.mapData[row][col].terrain], style, true);
                        }
                        rect.setStyle(style);
                        this.appendChildren(rect);
                    }
                }
            }
        }
    }
}