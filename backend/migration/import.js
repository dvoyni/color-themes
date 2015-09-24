var fs = require("fs");
var db = require("../db");
var http = require("http");

function download(url, callback) {
    http.get(url, function(res) {
        var data = "";
        res.on("data", function (chunk) {
            data += chunk;
        });
        res.on("end", function() {
            callback(null, data);
        });
    }).on("error", function(err) {
        callback(err);
    });
}

download(process.env.THEMES, function(err, themes) {
    var processed = 0;
    db.connect(process.env.MONGO_URL,  function(err, models) {
        themes.forEach(data => {
            var theme = new db.models.Theme(data);
            theme.save(function() {
                processed++;
                if (processed == themes.length) {
                    process.exit();
                }
            });
        });
    });
});

