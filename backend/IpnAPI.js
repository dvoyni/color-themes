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

    new Promise(
        (resolve, reject) => {
            https.request({
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
                        resolve(result);
                    });

                    response.on("error", function(err) {
                        reject(err);
                    });
                })
                .end("cmd=_notify-validate&" + req.rawBody);
        })
        .then(result => {
            var valid = (result === "VERIFIED") &&
                (transaction.payment_status === "Completed") &&
                (transaction.receiver_email === process.env.PAYPAL_EMAIL) &&
                (transaction.mc_gross + transaction.mc_currency === process.env.PAYPAL_PRICE);

            if (!valid) {
                throw new Error("Invalid PayPal transaction ", JSON.stringify(transaction));
            }
            Log.info("INP transaction valid", transaction.payer_email);

            var email = transaction.custom || transaction.payer_email;

            return Database.models.Account.findOne({email: email});
        })
        .then(account => {
            if (!account) {
                Log.info("Account not found for transaction", transaction.payer_email);
                if (transaction.payer_email) {
                    var password = Utils.generatePin();
                    return Utils.registerUser_p({email: transaction.payer_email, password: password}, true)
                        .then(account => {
                            if (account) {
                                Log.info("Account created found for transaction", transaction.payer_email);
                                return Utils.sendEmail_p(transaction.payer_email, "Download all color themes",
                                    "Hey!\n\n" +
                                    "Since you were not registered on the site we've created an account for you.\n" +
                                    "Email: " + transaction.payer_email + "\n" +
                                    "Password: " + password + "\n\n" +
                                    "Please proceed to http://color-themes.com/?view=download-all and log in to download all themes.\n\n" +
                                    "Feel free to reply this email if you experiencing any troubles.\n\n" +
                                    "Cheers,\n" +
                                    "Color-themes.com");
                            }
                            else {
                                throw new Error("Failed to create an account for " + transaction.payer_email);
                            }
                        });
                }
            }
            else {
                Log.info("Making user premium: ", account.email);
                account.isPremium = true;
                return account.save();
            }
        })
        .then(()=> Log.info("Transaction processed successfully"))
        .catch(err => Log.error(err, req));
});

module.exports = router;
