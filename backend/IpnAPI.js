var express = require("express");
var https = require("https");
var router = express.Router();
var Log = require("./Log");
var Database = require("./Database");
var Utils = require("./Utils");

router.post("/", function(req, res) {
    var transaction = req.body;
    res.status(200).end();

    Log.info("INP transaction from", transaction.payer_email);

    var post = https.request({
            host: "www.paypal.com",
            path: "/cgi-bin/webscr",
            method: "POST",
            port: 443,
            headers: {
                Connection: "Close",
                "User-Agent": "color-themes.com"
            }
        },
        function(response) {
            var result = "";
            response.on("data", function(chunk) {
                result += chunk;
            });

            response.on("end", function() {
                var valid = (result === "VERIFIED") &&
                    (transaction.payment_status === "Completed") &&
                    (transaction.receiver_email === process.env.PAYPAL_EMAIL) &&
                    (transaction.mc_gross + transaction.mc_currency === process.env.PAYPAL_PRICE);
                if (valid) {
                    Log.info("INP transaction valid", transaction.payer_email);

                    var email = transaction.custom || transaction.payer_email;

                    Database.models.Account.findOne({email: email}, function(err, account) {
                        if (err) {
                            Log.error(err);
                            return;
                        }
                        if (!account) {
                            Log.info("Account not found for transaction", transaction.payer_email);
                            if (email) {
                                var password = Utils.generatePin();
                                Utils.registerUser({email: email, password: password}, true,
                                    function(status, message, account) {
                                        if (account) {
                                            Log.info("Account created found for transaction", transaction.payer_email);
                                            Utils.sendEmail(email, "Download all color themes",
                                                "Hey!\n\n" +
                                                "Since you were not registered on the site we've created an account for you.\n" +
                                                "Email: " + email + "\n" +
                                                "Password: " + password + "\n\n" +
                                                "Please proceed to http://color-themes.com/?view=download-all and log in to download all themes.\n\n" +
                                                "Feel free to reply this email if you experiencing any troubles.\n\n" +
                                                "Cheers,\n" +
                                                "Color-themes.com");
                                        }
                                        else {
                                            Log.info("Failed to create an account for transaction", transaction.payer_email);
                                        }
                                    });
                            }
                        }
                        else {
                            Log.info("Making user premium", email);
                            account.isPremium = true;
                            account.save(function(err) {
                                Log.error("Cannot save user after payment");
                                Log.error(err);
                            });
                        }
                    });
                }
                else {
                    Log.error("Invalid PayPal transaction", transaction);
                }
            });
        });
    post.end("cmd=_notify-validate&" + req.rawBody);
});

module.exports = router;
