import ResizerController from "../controller/resizerController";

export default (name, style, child)=>{
  let ret = {
    name : name,
    controller: ResizerController,
    type: "rect",
    style: {
      x: style.x,
      y: style.y,
      width: 200,
      height: 18,
      draggable: true,
      zIndex: 2,
      fontSize: '16px',
      borderWidth: 1,
      cursor : "move",
      hover: function(){
        this.style.borderColor = '#6CCFFF'
        this.getComponentByName('resizeTop').style.alpha = 1;
        this.getComponentByName('resizeBottom').style.alpha = 1;
      },
      hoverout: function(){
        this.restoreStyle();
        this.getComponentByName('resizeTop').style.alpha = 0;
        this.getComponentByName('resizeBottom').style.alpha = 0;
      }
    },
    hasClip: false,
    children: [
      child,
      {
        type: "rect",
        name: "resizeTop",
        style: {
          x: function(){
            return this.parent.getWidth() / 2 - 10 / 2;
          },
          y: -4,
          width: 15,
          height: 8,
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: '#dfdfdf',
          borderRadius: 3,
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
        name: "resizeBottom",
        style: {
          x: function(){
            return this.parent.getWidth() / 2 - 10 / 2;
          },
          y: 12,
          width: 15,
          height: 8,
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: '#dfdfdf',
          borderRadius: 3,
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
      }
    ],
    events : {
      "click" : "selectText"
    }
  };
  return ret;
};
