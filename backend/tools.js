var Database = require("./Database");
var Log = require("./Log");
var Utils = require("./Utils");
var bcrypt = require('bcrypt');

var tools = {
    setpremium: function(email, premium) {
        Database.connect(process.env.MONGO_URL, function(err) {
            if (err) {
                throw err;
            }
            Database.models.Account.findOne({email: email}, function(err, acc) {
                if (err) {
                    throw  err;
                }
                if (!acc) {
                    throw "Not found";
                }
                acc.isPremium = !!premium;
                acc.save(function(err) {
                    if (err) {
                        throw  err;
                    }
                    Log.info("Done");
                    process.exit();
                });
            });
        });
    },

    userlist: function() {
        Database.connect(process.env.MONGO_URL, function(err) {
            if (err) {
                throw err;
            }
            Database.models.Account.find({}, function(err, accounts) {
                if (err) {
                    throw  err;
                }
                accounts.forEach(function(account) {
                    Log.info(account.email, "name =", account.name || "", "premium =", account.isPremium);
                });
                process.exit();
            });
        });
    },

    testemail: function(to) {
        Utils.sendEmail_p(to, "Hello from color-themes.com", "This is a test email")
            .then(() => {
                Log.info("Done");

                process.exit();
            })
            .catch(err => Log.error(err));
    }
};

tools[process.argv[2]].apply(null, process.argv.slice(3));
