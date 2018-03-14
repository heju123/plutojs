export default class LinkedItem<T>{
    value : T;
    next : LinkedItem<T>;
    prev : LinkedItem<T>;

    constructor(value) {
        this.value = value;
    }
}