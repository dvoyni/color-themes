var Database = require("./Database");
var Log = require("./Log");

var tools = {
    setpremium: function(email, premium) {
        Database.connect(process.env.MONGO_URL, function(err) {
            if (err) {
                throw err;
            }
            Database.models.Account.findOne({email: email}, function (err, acc) {
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
            Database.models.Account.find({}, function (err, accounts) {
                if (err) {
                    throw  err;
                }
                if (!acc) {
                    throw "Not found";
                }
                accounts.forEach(function(account) {
                    Logger.info(account.email, account.name, account.isPremium);
                });
            });
        });
    }
};

tools[process.argv[2]].apply(null, process.argv.slice(3));
