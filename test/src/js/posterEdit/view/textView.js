import TextController from "../controller/textController";

export default (name, style)=>{
  let ret = {
    name : name,
    controller: TextController,
    type: "rect",
    style: {
      x: style.x,
      y: style.y,
      width: 200,
      height: 20,
      draggable: true,
      zIndex: 2,
      fontSize: '16px',
      borderWidth: 1,
      cursor : "move",
      hover: {
        borderColor: '#6CCFFF'
      }
    },
    hasClip: false,
    children: [
      {
        type: "rect",
        name: 'textPanel',
        style: {
          x: 0,
          y: 0,
          width: '100%',
          height: '100%',
          fontColor: '#ffffff',
          multiLine: true,
          zIndex: 1
        },
        text: name
      },
      {
        type: "rect",
        style: {
          x: function(){
            return this.parent.getWidth() / 2 - 10 / 2;
          },
          y: -5,
          width: 10,
          height: 10,
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: '#dfdfdf',
          borderRadius: 5,
          shadow: {
            x: 0,
            y: 0,
            blur: 10,
            color: '#858585'
          },
          zIndex: 2
        }
      }
    ],
    events : {
      "click" : "selectText"
    }
  };
  return ret;
};
