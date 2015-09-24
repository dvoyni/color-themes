var fs = require("fs");
var db = require("../db");

fs.readFile("themes.json", function(err, themes) {
    var processed = 0;
    themes = JSON.parse(themes);
    db.connect(process.env.MONGO_URL, function() {
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

