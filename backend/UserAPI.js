var express = require("express");
var router = express.Router();
var Database = require("./Database");
var Log = require("./Log");
var bcrypt = require('bcrypt');

router.get("/status", function(req, res) {
    var session = req.session;
    if (!session.user) {
        res.status(404).end("User not logged in");
        return;
    }
    res.status(200).json(session.user);
});

router.post("/login", function(req, res) {
    var credentials = req.body;

    if (!credentials.email || !credentials.password) {
        res.status(400).end("Empty field(s)");
        return;
    }

    Database.models.Account.findOne({email: credentials.email}, function(err, account) {
        if (err) {
            Log.error(err);
            res.status(500).end("Database error");
            return;
        }
        if (!account) {
            res.status(400).end("User not found");
        }

        bcrypt.compare(credentials.password, account.password, function(err, match) {
            if (err) {
                Log.error(err);
                res.status(500).end("Internal server error");
                return;
            }
            if (!match) {
                res.status(403).end("Passwords do not match");
                return;
            }

            req.session.user = {
                name: account.name,
                email: account.email
            };
            res.status(200).json(req.session.user);
        });
    });
});

router.post("/logout", function(req, res) {
    req.session.user = null;
    res.status(200).json({logout: "success"});
});

router.post("/register", function(req, res) {
    var credentials = req.body;

    if (!credentials.email || !credentials.password) {
        res.status(400).end("Empty field(s)");
        return;
    }

    Database.models.Account.findOne({email: credentials.email}, function(err, account) {
        if (err) {
            Log.error(err);
            res.status(500).end("Database error");
            return;
        }
        if (account) {
            res.status(403).end("User exists");
            return;
        }

        bcrypt.hash(credentials.password, 8, function(err, hash) {
            if (err) {
                Log.error(err);
                res.status(500).end("Internal server error");
                return;
            }

            account = new Database.models.Account({
                email: credentials.email,
                name: credentials.name,
                password: hash
            });

            account.save(function(err) {
                if (err) {
                    Log.error(err);
                    res.status(500).end("Database error");
                    return;
                }

                req.session.user = {
                    name: account.name,
                    email: account.email
                };

                res.status(200).json(req.session.user);
            });
        });
    });
});

module.exports = router;
