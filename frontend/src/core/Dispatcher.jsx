var handlers = {};

function getHandlers(name) {
    var eventHandlers = handlers[name];
    if (!eventHandlers) {
        handlers[name] = eventHandlers = [];
    }
    return eventHandlers;
}

var Dispatcher = {
    on(name, handler, context) {
        getHandlers(name).push({handler: handler, context: context || this});
    },

    off(name, handler) {
        this.handlers[name] = getHandlers(name).filter(info => info.handler != handler);
    },

    trigger(name) {
        var args = Array.prototype.slice.call(arguments, 1);
        getHandlers(name).forEach(info => info.handler.apply(info.context, args));
    }
};

module.exports = Dispatcher;
