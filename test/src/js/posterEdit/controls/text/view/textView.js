import TextController from "../controller/textController";

export default (name, style)=>{
  let ret = {
      type: "rect",
      name: "textCom",
      controller: TextController,
      style: {
        x: 0,
        y: 0,
        width: '100%',
        height: '100%',
        fontColor: '#ffffff',
        multiLine: true,
        autoLine: true,
        zIndex: 1,
        borderWidth: 2,
        fontSize: style && style.fontSize ? style.fontSize : '14px'
      },
      text: name
  };
  return ret;
};
