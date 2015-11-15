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

    registerUser_p: function(credentials, isPremium) {
        return Promise.resolve(credentials)
            .then(credentials => {
                if (!credentials.email || !credentials.password) {
                    throw 400;
                }

                return Database.models.Account.findOne({email: credentials.email});
            })
            .then(account => {
                if (account) {
                    throw 403;
                }

                return bcrypt.hash.call_p(bcrypt, credentials.password, 8);
            })
            .then(hash => {
                var account = new Database.models.Account({
                    email: credentials.email,
                    name: credentials.name,
                    password: hash,
                    isPremium: isPremium
                });

                return account.save();
            });
    },

    sendEmail_p: function(to, subj, message) {
        var mailOptions = {
            from: Utils.getBrand() + " <" + process.env.EMAIL + ">",
            to: to,
            subject: subj,
            text: message
        };

        return transport.sendMail.call_p(transport, mailOptions);
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

var transport = nodemailer.createTransport(Utils.getEmailConfig());

Function.prototype.call_p = function(context) {
    return new Promise((resolve, reject) => {
        this.call(context, ...Array.prototype.slice.call(arguments, 1), (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        })
    });
};

module.exports = Utils;
