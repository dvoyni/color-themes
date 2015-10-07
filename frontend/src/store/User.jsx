var request = require("core/Request");
var Application = require("core/Application");
var i18n = require("core/i18n");

var userInfo;
var validated = false;

var User = {
    getInfo(callback) {
        if (validated) {
            return callback(null, userInfo);
        }

        request.api("GET", "user-status", null, function(err, data) {
            if (!err) {
                userInfo = data;
                validated = true;
            }

            return callback(err, data);
        });
    },

    login(email, password, callback) {
        request.api("POST", "login", {email: email, password: password}, function(err, data) {
            if (!err) {
                userInfo = data;
                validated = true;
                return callback(err, data);
            }

            var code = parseInt(data);
            var message = i18n("Unknown error occured");
            if (code === 400) {
                message = i18n("Not all required fields were filled");
            }
            else if (code == 403) {
                message = i18n("Wrong password");
            }
            else if (code == 404) {
                message = i18n("Account with this email was not found");
            }
            callback(message);
        });
    },

    logout(callback) {
        request.api("POST", "logout", null, function(err, data) {
            if (!err) {
                userInfo = null;
                validated = true;
            }

            return callback(err, data);
        });
    },

    register(email, password, name, callback) {
        request.api("POST", "register", {email: email, password: password, name: name}, function(err, data) {
            if (!err) {
                userInfo = data;
                validated = true;
                return callback(err, data);
            }

            var code = parseInt(data);
            var message = i18n("Unknown error occured");
            if (code === 400) {
                message = i18n("Not all required fields were filled");
            }
            else if (code == 403) {
                message = i18n("Account with this email has already registered");
            }
            callback(message);
        });
    }
};

module.exports = User;
