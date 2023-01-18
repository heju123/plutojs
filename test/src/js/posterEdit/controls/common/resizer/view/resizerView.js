import ResizerController from "../controller/resizerController";

export default (name, style, child)=>{
  let ret = {
    name : name,
    controller: ResizerController,
    type: "rect",
    style: {
      x: style.x,
      y: style.y,
      width: style.width,
      height: style.height,
      draggable: true,
      zIndex: 2,
      fontSize: '16px',
      borderWidth: 1,
      cursor : "move",
      hover: function(){
        this.style.borderColor = '#6CCFFF'
        this.getComponentByName('resizeTop').style.alpha = 1;
        this.getComponentByName('resizeTopRight').style.alpha = 1;
        this.getComponentByName('resizeRight').style.alpha = 1;
        this.getComponentByName('resizeBottomRight').style.alpha = 1;
        this.getComponentByName('resizeBottom').style.alpha = 1;
        this.getComponentByName('resizeBottomLeft').style.alpha = 1;
        this.getComponentByName('resizeLeft').style.alpha = 1;
        this.getComponentByName('resizeTopLeft').style.alpha = 1;
      },
      hoverout: function(){
        this.restoreStyle();
        this.getComponentByName('resizeTop').style.alpha = 0;
        this.getComponentByName('resizeTopRight').style.alpha = 0;
        this.getComponentByName('resizeRight').style.alpha = 0;
        this.getComponentByName('resizeBottomRight').style.alpha = 0;
        this.getComponentByName('resizeBottom').style.alpha = 0;
        this.getComponentByName('resizeBottomLeft').style.alpha = 0;
        this.getComponentByName('resizeLeft').style.alpha = 0;
        this.getComponentByName('resizeTopLeft').style.alpha = 0;
      }
    },
    hasClip: false,
    children: [
      child,
      {
        type: "rect",
        name: "resizeTop",
        style: {
          width: 10,
          height: 4,
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: '#dfdfdf',
          borderRadius: 2,
          shadow: {
            x: 0,
            y: 0,
            blur: 10,
            color: '#858585'
          },
          zIndex: 2,
          draggable: true,
          alwaysDraw: true,
          cursor : "n-resize",
          alpha: 0
        }
      },
      {
        type: "rect",
        name: "resizeTopRight",
        style: {
          width: 6,
          height: 6,
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: '#dfdfdf',
          borderRadius: 4,
          shadow: {
            x: 0,
            y: 0,
            blur: 10,
            color: '#858585'
          },
          zIndex: 2,
          draggable: true,
          alwaysDraw: true,
          cursor : "ne-resize",
          alpha: 0
        }
      },
      {
        type: "rect",
        name: "resizeRight",
        style: {
          width: 4,
          height: 10,
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: '#dfdfdf',
          borderRadius: 2,
          shadow: {
            x: 0,
            y: 0,
            blur: 10,
            color: '#858585'
          },
          zIndex: 2,
          draggable: true,
          alwaysDraw: true,
          cursor : "e-resize",
          alpha: 0
        }
      },
      {
        type: "rect",
        name: "resizeBottomRight",
        style: {
          width: 6,
          height: 6,
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: '#dfdfdf',
          borderRadius: 4,
          shadow: {
            x: 0,
            y: 0,
            blur: 10,
            color: '#858585'
          },
          zIndex: 2,
          draggable: true,
          alwaysDraw: true,
          cursor : "se-resize",
          alpha: 0
        }
      },
      {
        type: "rect",
        name: "resizeBottom",
        style: {
          width: 10,
          height: 4,
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: '#dfdfdf',
          borderRadius: 2,
          shadow: {
            x: 0,
            y: 0,
            blur: 10,
            color: '#858585'
          },
          zIndex: 2,
          draggable: true,
          alwaysDraw: true,
          cursor : "n-resize",
          alpha: 0
        }
      },
      {
        type: "rect",
        name: "resizeBottomLeft",
        style: {
          width: 6,
          height: 6,
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: '#dfdfdf',
          borderRadius: 4,
          shadow: {
            x: 0,
            y: 0,
            blur: 10,
            color: '#858585'
          },
          zIndex: 2,
          draggable: true,
          alwaysDraw: true,
          cursor : "sw-resize",
          alpha: 0
        }
      },
      {
        type: "rect",
        name: "resizeLeft",
        style: {
          width: 4,
          height: 10,
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: '#dfdfdf',
          borderRadius: 2,
          shadow: {
            x: 0,
            y: 0,
            blur: 10,
            color: '#858585'
          },
          zIndex: 2,
          draggable: true,
          alwaysDraw: true,
          cursor : "e-resize",
          alpha: 0
        }
      },
      {
        type: "rect",
        name: "resizeTopLeft",
        style: {
          width: 6,
          height: 6,
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: '#dfdfdf',
          borderRadius: 4,
          shadow: {
            x: 0,
            y: 0,
            blur: 10,
            color: '#858585'
          },
          zIndex: 2,
          draggable: true,
          alwaysDraw: true,
          cursor : "nw-resize",
          alpha: 0
        }
      }
    ],
    events : {
      "click" : "selectText"
    }
  };
  return ret;
};
