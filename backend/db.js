var mongoose = require("mongoose");
var logger = require("./logger");

var DB = module.exports = {
    connect: function(uri, callback) {
        var db = mongoose.connection;

        db.on("error", function(err) {
            logger.error(err);
            callback(err);
        });

        db.once("open", function() {
            if (!DB.models) {
                var models = {};
                Object.keys(DB.schemas).forEach(function(name) {
                    models[name] = mongoose.model(name, DB.schemas[name]);
                });
                DB.models = models;
            }

            callback(null);
        });

        mongoose.connect(uri);
    },

    disconnect: function(callback) {
        mongoose.disconnect(callback);
    },

    schemas: {
        Theme: {
            title: String,
            styles: {},
            downloads: Number,
            date: Date,
            author: String,
            website: String,
            comment: String
        }
    }
};
