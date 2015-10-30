var express = require("express");
var router = express.Router();
var Utils = require("./Utils");

router.get("/", function(req, res) {
    res.status(200).json({
        email: process.env.EMAIL,
        price: process.env.PRICE,
        brand: Utils.getBrand()
    });
});

module.exports = router;
