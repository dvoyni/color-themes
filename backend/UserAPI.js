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
            return;
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

            updateSession(req.session, account);
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
    Utils.registerUser(credentials, false, function(status, message, account) {
        if (account) {
            updateSession(req.session, account);
            res.status(status).json(req.session.user);
        }
        else {
            res.status(status).end(message);
        }
    })

});

function updateSession(session, account) {
    session.user = {
        name: account.name,
        email: account.email,
        isPremium: account.isPremium
    };
}

module.exports = router;
