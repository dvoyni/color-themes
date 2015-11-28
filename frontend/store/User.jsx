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
            Request.api_p("GET", "user/status", {force: true})
                .then(data => store.dispatch(UserActions.setUser(data)))
                .catch(err => Application.showError(err));
        }
    }

    static login(email, password) {
        store.dispatch(UserActions.setPending());
        Request.api_p("POST", "user/login", {email: email, password: password})
            .then(data => store.dispatch(UserActions.setUser(data)))
            .catch(err => {
                store.dispatch(UserActions.setUser());

                var code = err.status;
                if (code === 400) {
                    throw i18n("Not all required fields were filled");
                }
                else if (code == 403) {
                    throw i18n("Wrong password");
                }
                else if (code == 404) {
                    throw i18n("Account with this email was not found");
                }
                throw i18n("Unknown error occured");
            })
            .catch(err => Application.showError(err));
    }

    static logout() {
        store.dispatch(UserActions.setPending());
        Request.api_p("POST", "user/logout")
            .then(data => store.dispatch(UserActions.setUser()))
            .catch(err => Application.showError(err));
    }

    static register(email, password, name) {
        store.dispatch(UserActions.setPending());
        Request.api_p("POST", "user/register", {
                email: email,
                password: password,
                name: name
            })
            .then(data => store.dispatch(UserActions.setUser(data)))
            .catch(err => {
                store.dispatch(UserActions.setUser());

                var code = err.status;
                if (code === 400) {
                    throw i18n("Not all required fields were filled");
                }
                else if (code == 403) {
                    throw i18n("Account with this email has already registered");
                }
                throw i18n("Unknown error occured");
            })
            .catch(err => Application.showError(err));
    }

    static restore(email) {
        store.dispatch(UserActions.setPending());
        Request.api_p("GET", "user/restore", {
                email: email
            })
            .then(() => {
                store.dispatch(UserActions.setUser());
                alert(i18n("Password has been sent"));//TODO: fix ugly alert
            })
            .catch(err => {
                store.dispatch(UserActions.setUser());

                var code = err.status;
                if (code === 400) {
                    throw i18n("Not all required fields were filled");
                }
                else if (code == 403) {
                    throw i18n("Account with this email has already registered");
                }
                throw i18n("Unknown error occured");
            })
            .catch(err => Application.showError(err));
    }
}
