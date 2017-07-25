/**
 * Created by heju on 2017/7/14.
 */
import commonUtil from "../../util/commonUtil.js";
import Component from "./component.js";

export default class Rect extends Component{
    constructor(cfg) {
        super(cfg);
        let $this = this;
        this.width = cfg.style.width;
        this.height = cfg.style.height;
        this.backgroundColor = cfg.style.backgroundColor;
        this.backgroundImage = cfg.style.backgroundImage;

        if (this.backgroundImage)
        {
            let img = new Image();
            img.onload = function(){
                $this.backgroundImageDom = this;
                if (!this.width || this.width === "auto")
                {
                    $this.width = $this.backgroundImageDom.width;
                }
                if (!this.height || this.height === "auto")
                {
                    $this.height = $this.backgroundImageDom.height;
                }
            };
            img.src = this.backgroundImage;
        }
    }

    draw(ctx){
        let parentArea = this.inParentArea(this);
        if (parentArea === 0)
        {
            return;
        }
        if (this.backgroundColor)
        {
            ctx.fillStyle = this.backgroundColor;
            ctx.fillRect(parentArea.x, parentArea.y, parentArea.width, parentArea.height);
        }

        if (this.backgroundImage && this.backgroundImageDom)
        {
            ctx.drawImage(this.backgroundImageDom,
                parentArea.x - this.getRealX(this),
                parentArea.y - this.getRealY(this),
                parentArea.width,parentArea.height,
                parentArea.x, parentArea.y, parentArea.width, parentArea.height);
        }
    }

    /**
     * 在parent区域内
     *
     * @return 0：不在范围内；{xx : xx}：在范围内
     */
    inParentArea(com){
        if (!com.parent)
        {
            return {
                x : this.getRealX(com),
                y : this.getRealY(com),
                width : com.width,
                height : com.height
            };
        }
        else{
            if (this.getRealX(com.parent) + com.parent.width < this.getRealX(com)
                || this.getRealX(com.parent) > this.getRealX(com) + com.width
                || this.getRealY(com.parent) + com.parent.height < this.getRealY(com)
                || this.getRealY(com.parent) > this.getRealY(com) + com.height)//不在parent范围内
            {
                return 0;
            }
            else
            {
                let width;
                let height;
                if (this.getRealX(com.parent) <= this.getRealX(com)
                    && this.getRealX(com.parent) + com.parent.width > this.getRealX(com) + com.width)//包含
                {
                    width = com.width;
                }
                else if (this.getRealX(com.parent) <= this.getRealX(com)
                    && this.getRealX(com.parent) + com.parent.width <= this.getRealX(com) + com.width)//x包含，width超出
                {
                    width = com.width - ((this.getRealX(com) + com.width) - (this.getRealX(com.parent) + com.parent.width));
                }
                else if (this.getRealX(com.parent) > this.getRealX(com)
                    && this.getRealX(com.parent) + com.parent.width > this.getRealX(com) + com.width)//x超出，width包含
                {
                    width = com.width - (this.getRealX(com) - this.getRealX(com.parent));
                }
                else if (this.getRealX(com.parent) > this.getRealX(com)
                    && this.getRealX(com.parent) + com.parent.width <= this.getRealX(com) + com.width)//x和width都超出
                {
                    width = com.parent.width;
                }

                if (this.getRealY(com.parent) <= this.getRealY(com)
                    && this.getRealY(com.parent) + com.parent.height > this.getRealY(com) + com.height)
                {
                    height = com.height;
                }
                else if (this.getRealY(com.parent) <= this.getRealY(com)
                    && this.getRealY(com.parent) + com.parent.height <= this.getRealY(com) + com.height)
                {
                    height = com.height - ((this.getRealY(com) + com.height) - (this.getRealY(com.parent) + com.parent.height));
                }
                else if (this.getRealY(com.parent) > this.getRealY(com)
                    && this.getRealY(com.parent) + com.parent.height > this.getRealY(com) + com.height)
                {
                    height = com.height - (this.getRealY(com) - this.getRealY(com.parent));
                }
                else if (this.getRealY(com.parent) > this.getRealY(com)
                    && this.getRealY(com.parent) + com.parent.height <= this.getRealY(com) + com.height)
                {
                    height = com.parent.height;
                }
                return {
                    x : this.getRealX(com.parent) < this.getRealX(com) ? this.getRealX(com) : this.getRealX(com.parent),
                    y : this.getRealY(com.parent) < this.getRealY(com) ? this.getRealY(com) : this.getRealY(com.parent),
                    width : width,
                    height : height
                };
            }
        }
    }
}