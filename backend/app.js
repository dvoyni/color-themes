var db = require("./db");
var logger = require("./logger");
var server = require("./server");

if (!process.env.DEBUG) {
    process.on('uncaughtException', function(err) {
        logger.error(err.stack + "\n" + err.message);
    });
}

console.log("Connecting to database");
db.connect(process.env.MONGO_URL, function(err) {
    if (err) {
        return console.error(err);
    }

    console.log("Starting server");
    server.listen(process.env.PORT || 80, function() {
        console.log("Server is online");
    });
});
