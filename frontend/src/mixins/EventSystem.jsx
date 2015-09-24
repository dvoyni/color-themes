var EventSystem = {
    on: function(name, handler, context) {
        if (!this.handlers) {
            this.handlers = {};
        }

        var handlers = this.handlers[name];
        if (!handlers) {
            this.handlers = handlers = [];
        }

        handlers.push({handler: handler, context: context || this});
    },

    off: function(name, handler) {
        var handlers = this.handlers && this.handlers[name];
        if (handlers) {
            this.handlers[name] = handlers.filter(info => info.handler != handler);
        }
    },

    trigger: function() {
        var handlers = this.handlers && this.handlers[name];
        var args = Array.prototype.slice.call(arguments, 1);
        if (handlers) {
            handlers.forEach(info => info.handler.apply(info.context, args));
        }
    }
};

module.exports = EventSystem;
