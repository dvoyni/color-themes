import Dispatcher from "./Dispatcher";

export default class Store {
    dispatcher = new Dispatcher();
    items = [];
    available = 0;

    clear() {
        this.items = [];
        this.dispatcher.trigger("clear", this);
    }

    add(items) {
        this.items.push.apply(this.items, items);
        this.dispatcher.trigger("change", this);
    }

    setAvailable(amount) {
        this.available = amount;
        this.dispatcher.trigger("availableChange", this)
    }
}
