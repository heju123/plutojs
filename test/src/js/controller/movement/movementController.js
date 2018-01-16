import {Controller} from "../../../../../src/js/main";
import spriteAction from "../../view/movement/spriteAction.js";

export default class MovementController extends Controller{
    constructor(component) {
        super(component);
        this.currentAction = spriteAction.stay;

        this.registerEvent("$onViewLoaded", ()=>{
            let map = this.component.getComponentByName("mapTest");
            this.sprite = this.component.getComponentByName("sprite1");
            this.sprite.status = "stay";
            this.sprite.yAcceleration = 0.05;
            const speed = 1.5;
            const jumpSpeed = -4;

            this.sprite.onCollision = (data)=>{
                console.log(data);
            };

            this.setSpriteAction();

            map.registerEvent("keydown", (e)=>{
                switch (e.keyCode)
                {
                    case 87 : //w
                        this.sprite.ySpeed = jumpSpeed;
                        break;
                    case 65 : //a
                        this.sprite.xSpeed = -speed;
                        this.setSpriteAction(spriteAction.run);
                        this.sprite.setStyle("mirror", "horizontal");
                        if (this.sprite.status === "stay")
                        {
                            this.sprite.setY(this.sprite.getY() + (spriteAction.stay.height - spriteAction.run.height) - 1);
                        }
                        this.sprite.status = "run";
                        break;
                    case 68 : //d
                        this.sprite.xSpeed = speed;
                        this.setSpriteAction(spriteAction.run);
                        this.sprite.removeStyle("mirror");
                        if (this.sprite.status === "stay")
                        {
                            this.sprite.setY(this.sprite.getY() + (spriteAction.stay.height - spriteAction.run.height) - 1);
                        }
                        this.sprite.status = "run";
                        break;
                    default : break;
                }
            });
            map.registerEvent("keyup", (e)=>{
                switch (e.keyCode)
                {
                    case 65 : //a
                    case 68 : //d
                        this.sprite.xSpeed = 0;
                        this.setSpriteAction(spriteAction.stay);
                        if (this.sprite.status === "run")
                        {
                            this.sprite.setY(this.sprite.getY() - (spriteAction.stay.height - spriteAction.run.height));
                        }
                        this.sprite.status = "stay";
                        break;
                    default : break;
                }
            });
        });
    }

    setSpriteAction(action){
        if (action)
        {
            this.currentAction = action;
        }

        this.sprite.setStyle({
            "width" : this.currentAction.width,
            "height" : this.currentAction.height,
            "backgroundImage" : this.currentAction.backgroundImage,
            "backgroundImages" : this.currentAction.backgroundImages,
            "backgroundImagesInterval" : this.currentAction.backgroundImagesInterval
        });
    }

    back(e){
        console.log(e);
        let mainRoute = this.viewState.getComponentById("mainRoute");
        mainRoute.changeRoute("main", true);
    }
}