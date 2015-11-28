var Log = require("log4js");
var Utils = require("./Utils");

Log.configure({
    "replaceConsole": true,
    "appenders": process.env.DEBUG ? [{"type": "console"}] :
        [
            {
                "type": "console"
            },
            {
                "type": "logLevelFilter",
                "level": "ERROR",
                "appender": {
                    "type": "smtp",
                    "recipients": process.env.EMAIL,
                    "sender": process.env.EMAIL,
                    "sendInterval": process.env.LOG_EMAIL_INTERVAL || 30,
                    "transport": "SMTP",
                    "SMTP": Utils.getEmailConfig()
                }
            }
        ]
});

var logger = Log.getLogger();

module.exports = {
    error: function(err, req) {
        if (req) {
            logger.error(req.method, req.originalUrl, req.body);
        }
        logger.error.call(logger, err);
    },
    info: function() {
        logger.info.apply(logger, arguments);
    }
};
