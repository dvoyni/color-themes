import Request from "../core/Request";
import Application from "../core/Application";
import i18n from "../core/i18n";

var userInfo;
var validated = false;

export default class User {
    static getInfo(callback) {
        /*if (validated) {
            return callback(null, userInfo);
        }*/

        Request.api("GET", "user/status", null, function(err, data) {
            if (!err) {
                userInfo = data;
                validated = true;
            }

            return callback(err, data);
        });
    }

    static login(email, password, callback) {
        Request.api("POST", "user/login", {email: email, password: password}, function(err, data) {
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
    }

    static logout(callback) {
        Request.api("POST", "user/logout", null, function(err, data) {
            if (!err) {
                userInfo = null;
                validated = true;
            }

            return callback(err, data);
        });
    }

    static register(email, password, name, callback) {
        Request.api("POST", "user/register", {email: email, password: password, name: name}, function(err, data) {
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
}
