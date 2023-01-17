import TextController from "../controller/textController";

export default (name)=>{
  let ret = {
      type: "rect",
      name: name,
      controller: TextController,
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
  };
  return ret;
};
