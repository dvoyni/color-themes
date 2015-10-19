import Store from "../core/Settings";

export default class Constraints {
    static loggedIn() {
        var userName = Store.getItem("userName");
        if (!userName) {
            return "login"
        }
        return null;
    }
};
