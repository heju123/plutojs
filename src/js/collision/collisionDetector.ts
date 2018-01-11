import Component from "../ui/components/component";
import MPromise from "../util/promise";
import Thread from "../util/thread";

interface CollisionDetector{
    thread_detectCollision : Function;
    detectCollision(com : Component, sx : number, sy : number, thread : Thread, fixCoor? : boolean) : MPromise
}
export default CollisionDetector