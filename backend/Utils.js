var bcrypt = require('bcrypt');
var Log = require("./Log");
var Database = require("./Database");
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.LOG_EMAIL_USER,
        pass: process.env.LOG_EMAIL_PASSWORD
    }
});

module.exports = {
    generatePin: function() {
        var pin = String(parseInt(Math.random() * 10000));
        while (pin.length < 5) {
            pin = '0' + pin;
        }
        return pin;
    },

    registerUser: function(credentials, isPremium, callback) {
        if (!credentials.email || !credentials.password) {
            callback(400, "Empty field(s)");
            return;
        }

        Database.models.Account.findOne({email: credentials.email}, function(err, account) {
            if (err) {
                Log.error(err);
                callback(500, "Database error");
                return;
            }
            if (account) {
                callback(403, "User exists");
                return;
            }

            bcrypt.hash(credentials.password, 8, function(err, hash) {
                if (err) {
                    Log.error(err);
                    callback(500, "Internal server error");
                    return;
                }

                account = new Database.models.Account({
                    email: credentials.email,
                    name: credentials.name,
                    password: hash,
                    isPremium: isPremium
                });

                account.save(function(err) {
                    if (err) {
                        Log.error(err);
                        callback(500, "Database error");
                        return;
                    }
                    callback(200, "", account);
                });
            });
        });
    },

    sendEmail: function(to, subj, message, callback) {
        var mailOptions = {
            from: "color-themes.com <" + process.env.LOG_EMAIL_TO + ">",
            to: to,
            subject: subj,
            text: message
        };

        transporter.sendMail(mailOptions, callback);
    }
};
