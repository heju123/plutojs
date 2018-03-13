export default class LinkedList{
    head : any;
    rear : any;

    constructor() {
    }

    add(obj : any){
        if (obj)
        {
            let data : any = {
                value : obj
            };
            if (!this.head)
            {
                this.head = data;
                this.rear = data;
            }
            this.rear.next = data;
            data.prev = this.rear;
            this.rear = data;
        }
    }
}