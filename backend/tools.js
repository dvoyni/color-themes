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
            Database.models.Account.find({}, function (err, accounts) {
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
        Utils.sendEmail(to, "Hello from color-themes.com", "This is a test email", function(err) {
            if (err) {
                throw err;
            }
            Log.info("Done");
            process.exit();
        })
    },

    resetpassword: function(email) {
        Database.connect(process.env.MONGO_URL, function(err) {
            if (err) {
                throw err;
            }
            Database.models.Account.findOne({email: email}, function(err, account) {
                if (err) {
                    throw err;
                }
                if (!account) {
                    throw "Not found";
                }

                var password = Utils.generatePin();

                bcrypt.hash(password, 8, function(err, hash) {
                    if (err) {
                        throw err;
                    }

                    account.password = hash;

                    account.save(function(err) {
                        if (err) {
                            throw err;
                        }

                        Utils.sendEmail(email, "Password reset",
                            "Hey!\n\n" +
                            "You password has been reset.\n" +
                            "Email: " + email + "\n" +
                            "Password: " + password + "\n\n" +
                            "Feel free to reply this email if you experiencing any troubles.\n\n" +
                            "Cheers,\n" +
                            "Color-themes.com", function(err) {
                                if (err) {
                                    throw  err;
                                }
                                Log.info("Done");
                                process.exit();
                            });
                    });
                });
            });
        });
    }
};

tools[process.argv[2]].apply(null, process.argv.slice(3));
