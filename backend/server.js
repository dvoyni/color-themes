var app = require("koa")();
var serve = require('koa-static');
var router = require('koa-router')();
var logger = require("./logger");
var path = require("path");
var db = require("./db");

router.get('/api/themes', function *(next) {
    this.body = yield function(done) {
        db.models.Theme.find({}).exec(done);
    }
});

app.use(serve(path.join(__dirname, "../static")));

app.use(router.routes());
app.use(router.allowedMethods());

app.on("error", function(err){
    logger.error(err.message);
});

module.exports = app;
