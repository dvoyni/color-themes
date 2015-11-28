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

function rawBody(req, res, buf) {
    req.rawBody = String(buf);
}

app.use(bodyParser.json({limit: 1024 * 1024, verify: rawBody}));
app.use(bodyParser.urlencoded({limit: 1024 * 1024, extended: true, verify: rawBody}));

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

app.use(function(req, res, next) {
    Log.info(req.originalUrl, req.body);
    next();
});

app.use("/api/themes/", require("./ThemesAPI"));
app.use("/api/user/", require("./UserAPI"));
app.use("/api/ipn/", require("./IpnAPI"));
app.use("/api/config/", require("./ConfigAPI"));

app.use(function(err, req, res, next) {
    Log.error(err.stack, req);
    res.status(500).end("Internal server error");
});

Log.info("Connecting to database");
Database.connect_p(process.env.MONGO_URL)
    .then(() => {
        Log.info("Starting server");
        var server = app.listen(process.env.PORT || 80, function() {
            var port = server.address().port;
            Log.info(`Server listening at port ${port}.`);
        });
    })
    .catch(err => Log.error(err));
