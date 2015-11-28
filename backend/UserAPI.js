var express = require("express");
var router = express.Router();
var Database = require("./Database");
var Log = require("./Log");
var bcrypt = require('bcrypt');
var Utils = require("./Utils");

router.get("/status", function(req, res) {
    var session = req.session;
    if (!session.user) {
        res.status(200).json({name: "", email: ""});
        return;
    }
    if (req.query.force) {
        Database.models.Account.findOne({email: session.user.email})
            .then(account => {
                res.status(200).json({
                    name: account.name,
                    email: account.email,
                    isPremium: account.isPremium
                });
            });
    }
    else {
        res.status(200).json(session.user);
    }
});

router.post("/login", function(req, res) {
    var credentials = req.body;
    var account;

    Promise.resolve(credentials)
        .then(credentials => {

            if (!credentials.email || !credentials.password) {
                throw 400;
            }

            return Database.models.Account.findOne({email: credentials.email});
        })
        .then(acc => {
            if (!acc) {
                throw 404;
            }
            account = acc;
            return bcrypt.compare.call_p(bcrypt, credentials.password, acc.password);
        })
        .then(match => {
            if (!match) {
                throw 403;
            }

            updateSession(req.session, account);
            res.status(200).json(req.session.user);
        })
        .catch(err => {
            if (err === 400) {
                res.status(400).end("Empty field(s)");
            }
            else if (err === 403) {
                res.status(403).end("Passwords do not match");
            }
            else if (err === 404) {
                res.status(404).end("User not found");
            }
            else {
                Log.error(err, req);
                res.status(500).end("Internal server error");
            }
        });
});

router.post("/logout", function(req, res) {
    req.session.user = null;
    res.status(200).json({logout: "success"});
});

router.post("/register", function(req, res) {
    var credentials = req.body;
    Utils.registerUser_p(credentials, false)
        .then(account => {
            updateSession(req.session, account);
            res.status(200).json(req.session.user);
        })
        .catch(err => {
            if (err === 400) {
                res.status(400).end("Empty field(s)");
            }
            else if (err === 403) {
                res.status(403).end("User exists");
            }
            else {
                Log.error(err, req);
                res.status(500).end("Internal server error");
            }
        });
});

router.get("/restore", function(req, res) {
    var credentials = req.query;
    var password = Utils.generatePin();
    var account;

    Promise.resolve(credentials)
        .then(credentials => {

            if (!credentials.email) {
                throw 400;
            }

            return Database.models.Account.findOne({email: credentials.email});
        })
        .then(acc => {
            if (!acc) {
                throw 404;
            }
            account = acc;
            return bcrypt.hash.call_p(bcrypt, password, 8);
        })
        .then(hash => {
            account.password = hash;
            return account.save();
        })
        .then(account => {
            return Utils.sendEmail_p(account.email, "Password reset",
                        "Hey!\n\n" +
                        "You password has been reset.\n" +
                        "Email: " + account.email + "\n" +
                        "Password: " + password + "\n\n" +
                        "Feel free to reply to this email if you experiencing any troubles.\n\n" +
                        "Cheers,\n" +
                        "color-themes.com");
        })
        .then(() => {
            res.status(200).json({stats: "success"});
        })
        .catch(err => {
            if (err === 400) {
                res.status(400).end("Empty field(s)");
            }
            else if (err === 404) {
                res.status(404).end("User not found");
            }
            else {
                Log.error(err, req);
                res.status(500).end("Internal server error");
            }
        });
});

function updateSession(session, account) {
    session.user = {
        name: account.name,
        email: account.email,
        isPremium: account.isPremium
    };
}

module.exports = router;
