var Store = require("core/Store");

var Constraints = {
    loggedIn() {
        var userName = Store.getItem("userName");
        if (!userName) {
            return "login"
        }
        return null;
    }
};

module.exports = Constraints;
