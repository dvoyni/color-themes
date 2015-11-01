var Database = require("./Database");

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
    }
};

tools[process.argv[0]].apply(null, process.argv.slice(1));
