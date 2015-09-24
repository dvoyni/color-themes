var db = require("./db");
var logger = require("./logger");
var server = require("./server");

process.on('uncaughtException', function(err) {
    logger.error(err.stack, "\n", err.message);
});

logger.info("Connecting to database");
db.connect(process.env.MONGO_URL, function(err) {
    if (err) {
        return logger.error(err);
    }

    logger.info("Starting server");
    server.listen(process.env.PORT || 80, function() {
        logger.info("Server is online");
    });
});
