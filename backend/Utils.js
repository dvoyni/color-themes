var bcrypt = require('bcrypt');
var Database = require("./Database");
var nodemailer = require('nodemailer');

var Utils = {
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

        var Log = require("./Log");

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
            from: Utils.getBrand() + " <" + process.env.EMAIL + ">",
            to: to,
            subject: subj,
            text: message
        };

        transporter.sendMail(mailOptions, function(err) {
            if (err) {
                var Log = require("./Log");
                Log.error(err);
            }
            if (callback) {
                callback.apply(this, arguments);
            }
        });
    },

    getEmailConfig: function() {
        if (process.env.SMTP_SERVICE) {
            return {
                service: "yandex",
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASSWORD
                }
            }
        }
        else {
            return {
                host: process.env.SMTP_HOST,
                secureConnection: process.env.SMTP_SECURE === "true",
                port: parseInt(process.env.SMTP_PORT, 10),
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASSWORD
                }
            }
        }
    },

    getBrand: function() {
        return (process.env.BRAND || "Color Themes");
    }
};

var transporter = nodemailer.createTransport(Utils.getEmailConfig());

module.exports = Utils;
