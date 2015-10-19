export default class Dispatcher {
    handlers = {};

    getHandlers(name) {
        var eventHandlers = this.handlers[name];
        if (!eventHandlers) {
            this.handlers[name] = eventHandlers = [];
        }
        return eventHandlers;
    }

    on(name, handler) {
        this.getHandlers(name).push(handler);
    }

    off(name, handler) {
        this.handlers[name] = this.getHandlers(name).filter(info => info.handler != handler);
    }

    trigger(name, ...params) {
        this.getHandlers(name).forEach(handler => handler.apply(null, params));
    }
}
