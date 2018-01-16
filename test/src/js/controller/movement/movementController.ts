import {Controller,Component,Sprite} from "~/js/main";
import spriteAction from "../../view/movement/spriteAction.js";

export default class MovementController extends Controller{
    private currentAction : any;
    private sprite : Component;

    constructor(component : Component) {
        super(component);
        this.currentAction = spriteAction.stay;

        this.registerEvent("$onViewLoaded", ()=>{
            let map = this.component.getComponentByName("mapTest");
            this.sprite = this.component.getComponentByName("sprite1");
            (<any>this.sprite).status = "stay";
            (<Sprite>this.sprite).yAcceleration = 0.05;
            const speed = 1.5;
            const jumpSpeed = -4;

            (<Sprite>this.sprite).onCollision = (data)=>{
                console.log(data);
            };

            this.setSpriteAction();

            map.registerEvent("keydown", (e)=>{
                switch (e.keyCode)
                {
                    case 87 : //w
                        (<Sprite>this.sprite).ySpeed = jumpSpeed;
                        break;
                    case 65 : //a
                        (<Sprite>this.sprite).xSpeed = -speed;
                        this.setSpriteAction(spriteAction.run);
                        this.sprite.setStyle("mirror", "horizontal");
                        if ((<any>this.sprite).status === "stay")
                        {
                            this.sprite.setY(this.sprite.getY() + (spriteAction.stay.height - spriteAction.run.height) - 1);
                        }
                        (<any>this.sprite).status = "run";
                        break;
                    case 68 : //d
                        (<Sprite>this.sprite).xSpeed = speed;
                        this.setSpriteAction(spriteAction.run);
                        this.sprite.removeStyle("mirror");
                        if ((<any>this.sprite).status === "stay")
                        {
                            this.sprite.setY(this.sprite.getY() + (spriteAction.stay.height - spriteAction.run.height) - 1);
                        }
                        (<any>this.sprite).status = "run";
                        break;
                    default : break;
                }
            });
            map.registerEvent("keyup", (e)=>{
                switch (e.keyCode)
                {
                    case 65 : //a
                    case 68 : //d
                        (<Sprite>this.sprite).xSpeed = 0;
                        this.setSpriteAction(spriteAction.stay);
                        if ((<any>this.sprite).status === "run")
                        {
                            this.sprite.setY(this.sprite.getY() - (spriteAction.stay.height - spriteAction.run.height));
                        }
                        (<any>this.sprite).status = "stay";
                        break;
                    default : break;
                }
            });
        });
    }

    setSpriteAction(action? : any){
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