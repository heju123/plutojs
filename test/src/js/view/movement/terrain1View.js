export default (x, y, size)=>{
    return {
        type: "rect",
        style: {
            x: x,
            y: y,
            width: size,
            height: size,
            backgroundColor: "#a8cbff"
        }
    };
}