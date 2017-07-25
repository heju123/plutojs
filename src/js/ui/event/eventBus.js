/**
 * Created by heju on 2017/7/25.
 */
export default class EventBus{
    constructor(canvas){
        this.canvas = canvas;

        if (window.addEventListener)
        {
            this.canvas.addEventListener("click", function(e){
            }, false);
        }
        else
        {
            this.canvas.attachEvent("click", function(e){
            });
        }
    }
}