var Log = require("./Log");
var Database = require("./Database");
var express = require("express");
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require("path");

process.on('uncaughtException', function(err) {
    Log.error(err.stack);
});

var app = express();

app.use(bodyParser.json({limit: 1024 * 1024}));

app.set('trust proxy', 1);
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, //TODO: sst true when serving over https
        maxAge: 60 * 60 * 24 * 365 * 100
    }
}));

app.use(express.static(
    path.normalize(path.join(__dirname, "..", "build")),
    {
        index: 'index.html'
    }));

app.use("/api/themes/", require("./ThemesAPI"));
app.use("/api/user/", require("./UserAPI"));

app.use(function(err, req, res, next){
    Log.error(err.stack);
    res.status(500).end("Internal server error");
});

Log.info("Connecting to database");
Database.connect(process.env.MONGO_URL, function(err) {
    if (err) {
        return Log.error(err);
    }

    Log.info("Starting server");
    var server = app.listen(process.env.PORT || 30, function() {
        var port = server.address().port;
        Log.info(`Server listening at port ${port}.`);
    });
});
