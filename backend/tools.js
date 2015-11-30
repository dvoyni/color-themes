var Database = require("./Database");
var Log = require("./Log");
var Utils = require("./Utils");
var bcrypt = require('bcrypt');

var tools = {
    setpremium: function(email, premium) {
        Database.connect_p(process.env.MONGO_URL)
            .then(() => Database.models.Account.findOne({email: email}))
            .then(acc => {
                if (!acc) {
                    throw "Not found";
                }
                acc.isPremium = !!premium;
                return acc.save();
            })
            .then(() => {
                Log.info("Done");
                process.exit();
            })
            .catch(Log.error);
    },

    userlist: function() {
        Database.connect_p(process.env.MONGO_URL)
            .then(() => Database.models.Account.find({}))
            .then(accounts => {
                accounts.forEach(function(account) {
                    Log.info(account.email, "name =", account.name || "", "premium =", account.isPremium);
                });
                process.exit();
            })
            .catch(Log.error);
    },

    testemail: function(to) {
        Utils.sendEmail_p(to, "Hello from color-themes.com", "This is a test email")
            .then(() => {
                Log.info("Done");

                process.exit();
            })
            .catch(Log.error);
    }
};

tools[process.argv[2]].apply(null, process.argv.slice(3));
