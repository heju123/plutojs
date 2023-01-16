import EditImageController from "../controller/editImageController";

export default (name, icon, style)=>{
  let ret = {
    name : name,
    controller: EditImageController,
    type: "rect",
    style: {
      x: style.x,
      y: style.y,
      width: 380,
      height: 620,
      draggable: true,
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
