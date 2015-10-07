var app = require("koa")();
var serve = require("koa-static");
var router = require("koa-router")();
var session = require("koa-session");
var parse = require("co-body");
var bcrypt = require('bcrypt');
var json = require('koa-json');

var logger = require("./logger");
var path = require("path");
var db = require("./db");

function token(email) {
    return email + "/" + [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].
            map(x => String.fromCharCode(Math.random() * 26 + 65)).join("");
}

function login(email, password) {
    return function(callback) {
        if (!email || !password) {
            return callback(null, {code: 400});
        }

        db.models.Account.findOne({email: email}, function(err, account) {
            if (err) {
                return callback(err);
            }
            if (!account) {
                return callback(null, {code: 404});
            }

            bcrypt.compare(password, account.password, function(err, match) {
                if (err) {
                    return callback(err);
                }
                if (!match) {
                    return callback(null, {code: 403});
                }
                account.token = token(email);
                account.save();
                callback(null, {
                    code: 200,
                    token: account.token,
                    name: account.name,
                    email: account.email
                });
            });
        });
    }
}

function register(email, password, name) {
    return function(callback) {
        if (!email || !password) {
            return callback(null, {code: 400});
        }

        db.models.Account.findOne({email: email}, function(err, account) {
            if (err) {
                return callback(err);
            }
            if (account) {
                return callback(null, {code: 403});
            }

            bcrypt.hash(password, 8, function(err, hash) {
                if (err) {
                    return callback(err);
                }

                account = new db.models.Account({
                    email: email,
                    name: name,
                    password: hash,
                    token: token(email)
                });

                account.save(function(err) {
                    if (err) {
                        return callback(err);
                    }

                    callback(null, {
                        code: 200,
                        token: account.token,
                        name: account.name,
                        email: account.email
                    });
                });
            });
        });
    }
}

function userStatus(token) {
    return function(callback) {
        if (!token) {
            return callback(null, {code: 404});
        }

        db.models.Account.findOne({token: token}, function(err, account) {
            if (err) {
                return callback(err);
            }
            if (!account) {
                return callback(null, {code: 404});
            }
            return callback(null, {
                code: 200,
                token: account.token,
                name: account.name,
                email: account.email
            });
        });
    }
}

router.get("/api/themes", function *(next) {
    this.body = yield function(done) {
        db.models.Theme.find({}).exec(done);
    }
});

router.post("/api/login", function *(next) {
    var credentials = yield parse.json(this, {limit: "1kb"});
    var result = yield login(credentials.email, credentials.password);
    this.response.status = result.code;
    this.session.token = result.token;
    this.body = {name: result.name, email: result.email};
});

router.post("/api/logout", function *(next) {
    this.session = null;
    this.body = {logout: "success"};
});

router.get("/api/user-status", function *(next) {
    var result = yield userStatus(this.session && this.session.token);
    this.response.status = result.code;
    this.body = {name: result.name, email: result.email};
});

router.post("/api/register", function *(next) {
    var credentials = yield parse.json(this, {limit: "1kb"});
    var result = yield register(credentials.email, credentials.password, credentials.name);
    this.response.status = result.code;
    this.session.token = result.token;
    this.body = {name: result.name, email: result.email};
});

app.keys = [process.env.SECRET];

app.use(json());
app.use(session(app));

app.use(serve(path.join(__dirname, "../static")));

app.use(router.routes());
app.use(router.allowedMethods());

if (!process.env.DEBUG) {
    app.on("error", function(err) {
        logger.error(err.message + "\n");
    });
}

module.exports = app;
