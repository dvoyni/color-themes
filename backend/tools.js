var Database = require("./Database");
var Log = require("./Log");
var Utils = require("./Utils");
var bcrypt = require("bcrypt");
var BuilderUtils = require("../frontend/builders/BuilderUtils");

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
    },

    fixcolors: function() {
        function fixColor(color) {
            while (color.length < 6) {
                color = "0" + color;
            }
            return color;
        }

        Database.connect_p(process.env.MONGO_URL)
            .then(() => Database.models.Theme.find({}))
            .then(themes => Promise.all(themes.map(theme => {
                if (theme.styles) {
                    Object.keys(theme.styles).forEach(styleName => {
                        var style = theme.styles[styleName];
                        if (style.color) style.color = fixColor(style.color);
                        if (style.backgroundColor) style.backgroundColor = fixColor(style.backgroundColor);
                        if (style.markerColor) style.markerColor = fixColor(style.markerColor);
                        if (style.effectColor) style.effectColor = fixColor(style.effectColor);
                    });
                    BuilderUtils.fillCss(theme.styles);
                    return theme.save();
                }
            })))
            .then(() => {
                Log.info("Done");
                process.exit();
            })
            .catch(Log.error);
    }
};

tools[process.argv[2]].apply(null, process.argv.slice(3));
