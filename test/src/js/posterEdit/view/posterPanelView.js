import PosterPanelController from "../controller/posterPanelController";

export default (name, icon, style)=>{
  let ret = {
    name : name,
    controller: PosterPanelController,
    type: "rect",
    style: {
      x: style.x,
      y: style.y,
      width: style.width,
      height: style.height,
      backgroundColor: '#ffffff',
      shadow: {
        x: 0,
        y: 0,
        blur: 15,
        color: '#858585'
      }
    },
    children: [
      {
        name: "image",
        type: "rect",
        style: {
          x: 0,
          y: 0,
          width: '100%',
          height: '100%',
          backgroundImage: icon,
          zIndex: 1
        }
      }
    ],
    events : {
      "click" : "clearSelect"
    }
  };
  return ret;
};
