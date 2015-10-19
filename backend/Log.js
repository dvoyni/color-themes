var Log = require ("log4js");

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
                    "recipients": process.env.LOG_EMAIL_TO,
                    "sender": "info@ideacolorthemes.org",
                    "sendInterval": process.env.LOG_EMAIL_INTERVAL || 30,
                    "transport": "SMTP",
                    "SMTP": {
                        service: "Gmail",
                        "auth": {
                            "user": process.env.LOG_EMAIL_USER,
                            "pass": process.env.LOG_EMAIL_PASSWORD
                        }
                    }
                }
            }
        ]
});

module.exports = Log.getLogger();

