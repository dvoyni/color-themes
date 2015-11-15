var mongoose = require("mongoose");
var Log = require("./Log");

module.exports = function() {
    "use strict";
    return class Database {

        static connect(uri, callback) {
            var db = mongoose.connection;

            db.on("error", function(err) {
                Log.error(err);
                callback(err);
            });

            db.once("open", () => {
                if (!this.models) {
                    this.models = Object.keys(this.schemas).reduce((models, name) => {
                        var schema = new mongoose.Schema(this.schemas[name]),
                            index = this.indices[name];
                        if (index) {
                            schema.index(index);
                        }
                        models[name] = mongoose.model(name, schema);
                        return models;
                    }, {});
                }
                callback();
            });

            mongoose.connect(uri);
        }

        static disconnect(callback) {
            mongoose.disconnect(callback);
        }

        static get schemas() {
            return {
                Theme: {
                    title: String,
                    styles: {},
                    downloads: {type: Number, index: true},
                    date: {type: Date, index: true},
                    author: String,
                    website: String,
                    comment: String,
                    authorId: String
                },

                Account: {
                    name: String,
                    email: {type: String, index: true},
                    password: String,
                    isPremium: Boolean,
                    website: String
                }
            }
        }

        static get indices() {
            return {
                /*Theme: {
                    title: "text",
                    comment: "text"
                }*/
            }
        }
    }
}();
