var Database = require("../Database");

Database.connect(process.env.SOURCE_DB, function() {
    Database.models.Theme.find({}).exec(function(err, themes) {
        var processed = 0;
        Database.disconnect(function() {
            Database.connect(process.env.MONGO_URL, function() {
                themes.forEach(data => {
                    var theme = new Database.models.Theme(data);
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
});

