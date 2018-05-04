/** 一些复杂绘制比如画圆或渐变等，用cache会性能一些 */
export default class Cache{
    private canvas : HTMLCanvasElement;
    isEmpty : boolean = true;

    constructor(width : number, height : number) {
        this.canvas = <HTMLCanvasElement>document.createElement("CANVAS");
        this.canvas.width = width;
        this.canvas.height = height;
    }

    getContext() : CanvasRenderingContext2D{
        return this.canvas.getContext('2d');
    }

    getCache() : HTMLCanvasElement{
        return this.canvas;
    }
}