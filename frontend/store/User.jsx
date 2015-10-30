import Request from "../core/Request";
import Application from "../core/Application";
import i18n from "../core/i18n";
import store from "./store";
import UserActions from "./state/user"

export default class User {
    static update(force) {
        var state = store.getState();
        if (force || !state.user.updated) {
            store.dispatch(UserActions.setPending());
            Request.api("GET", "user/status", null, function(err, data) {
                store.dispatch(UserActions.setUser(data, data));
            });
        }
    }

    static login(email, password) {
        store.dispatch(UserActions.setPending());
        Request.api("POST", "user/login", {email: email, password: password}, function(err, data) {
            if (!err) {
                store.dispatch(UserActions.setUser(data, data));
            }
            else {
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
                Application.showError(message);
                store.dispatch(UserActions.setUser());
            }
        });
    }

    static logout() {
        store.dispatch(UserActions.setPending());
        Request.api("POST", "user/logout", null, function(err, data) {
            if (!err) {
                store.dispatch(UserActions.setUser());
            }
            else {
                Application.showError(message);
            }
        });
    }

    static register(email, password, name) {
        store.dispatch(UserActions.setPending());
        Request.api("POST", "user/register", {email: email, password: password, name: name}, function(err, data) {
            if (!err) {
                store.dispatch(UserActions.setUser(data));
            }
            else {
                var code = parseInt(data);
                var message = i18n("Unknown error occured");
                if (code === 400) {
                    message = i18n("Not all required fields were filled");
                }
                else if (code == 403) {
                    message = i18n("Account with this email has already registered");
                }
                Application.showError(message);
                store.dispatch(UserActions.setUser());
            }
        });
    }
}
