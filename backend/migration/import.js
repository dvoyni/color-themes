var db = require("../db");

db.connect(process.env.SOURCE_DB, function() {
    db.models.Theme.find({}).exec(function(err, themes) {
        var processed = 0;
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
});

