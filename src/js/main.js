/**
 * Created by heju on 2017/7/10.
 */

class Main {
    constructor(eleId){
        var canvasDom = document.getElementById(eleId);
        var canvas = document.createElement("CANVAS");
        canvas.width = canvasDom.offsetWidth;
        canvas.height = canvasDom.offsetHeight;
        canvasDom.appendChild(canvas);
        var ctx = canvas.getContext('2d');
        ctx.strokeStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

window.Monk = Main;