var express = require("express");
var router = express.Router();
var Database = require("./Database");
var Log = require("./Log");
var Builders = require("../frontend/builders/Builders.js");
var BuilderUtils = require("../frontend/builders/BuilderUtils.js");

function getAllThemes(req, res) {
    Promise.resolve(req.session.user)
        .then(user => {
            return Database.models.Account.findOne({email: user.email});
        })
        .then(account => {
            if (!account.isPremium) {
                throw 403;
            }

            return Database.models.Theme.find({});
        })
        .then(themes => {
            res.status(200).json({
                themes: themes,
                total: themes.length
            });
        })
        .catch(err => {
            if (err == 403) {
                res.status(403).end("Forbidden");
            }
            else {
                Log.error(err, req);
                res.status(500).end("Database error");
            }
        });
}

function getThemesPage(req, res) {
    var options = req.query;

    var offset = parseInt(options.offset || 0),
        count = parseInt(options.count || 0),
        search = options.search || "",
        order = (options.order === "popular" ? "downloads" : "date"),
        sort = {};

    sort[order] = (options.order === "popular" ? -1 : 1);

    var query = {};
    if (search) {
        query = {title: new RegExp(search.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), "gi")};
    }

    Promise.all([
            Database.models.Theme.find(query).count(),
            Database.models.Theme.find(query).sort(sort).skip(offset).limit(count).exec()
        ])
        .then((data) => {
            var total = data[0];
            var themes = data[1];
            res.status(200).json({total, themes});
        })
        .catch(err => {
            Log.error(err, req);
            res.status(500).end("Database error");
        });
}

router.get("/compiled/:builder", function(req, res) {
    Promise.resolve(req.session.user)
        .then(user => {
            return Database.models.Account.findOne({email: user.email});
        })
        .then(account => {
            if (!account.isPremium) {
                throw 403;
            }
            return Database.models.Theme.find({});
        })
        .then(themes => {
            return BuilderUtils.buildAll_p(themes, req.params.builder, null, "nodebuffer");
        })
        .then(compiled => {
            var archive = compiled.data;
            var name = compiled.name;

            res.writeHead(200, {
                "Content-Type": "application/x-zip-compressed",
                "Content-Length": archive.length,
                "Content-Disposition": "attachment; filename=" + name
            });
            res.end(archive);
        })
        .catch(err => {
            if (err == 403) {
                res.status(403).end("Forbidden");
            }
            else {
                Log.error(err, req);
                res.status(500).end("Internal server error");
            }
        });

});

router.get("/", function(req, res) {
    if (req.query.all) {
        getAllThemes(req, res);
    }
    else {
        getThemesPage(req, res);
    }
});

router.post("/", function(req, res) {
    var account;

    Promise.resolve(req.session.user && req.session.user.email)
        .then(email => {
            if (!email) {
                throw 400;
            }
            if (!req.body.title || !req.body.styles) {
                throw 400;
            }

            return Database.models.Account.findOne({email});
        })
        .then(acc => {
            if (!acc) {
                throw 400;
            }
            account = acc;

            return Database.models.Theme.findOne({title: req.body.title});
        })
        .then(theme => {
            if (theme) {
                throw 403;
            }

            theme = new Database.models.Theme({
                title: req.body.title,
                styles: req.body.styles,
                downloads: 0,
                date: new Date().getUTCDate(),
                author: account.name || "Anonymous",
                website: account.website || "",
                comment: req.body.description,
                authorId: account._id
            });

            return theme.save();
        })
        .then(theme => {
            res.status(200).json(theme);
        })
        .catch(err => {
            if (err === 403) {
                res.status(403).end("Theme with given name already exists");
            }
            else if (err === 400) {
                res.status(400).end("Not all required fields are filled or user not logged in");
            }
            else {
                Log.error(err, req);
                res.status(500).end("Internal server error");
            }
        });
});

router.get("/:id/compiled/:builder", function(req, res) {
    Database.models.Theme.findOne({_id: req.params.id})
        .then(theme => {
            if (!theme) {
                throw 404;
            }
            var builder = Builders[req.params.builder];
            if (!builder) {
                throw 404;
            }
            return Promise.all([
                builder.build_p(theme, "nodebuffer"),
                increaseDownloadCounter_p(theme._id)
            ]);
        })
        .then((data) => {
            var built = data[0];
            var ignored = data[1];
            res.writeHead(200, {
                "Content-Type": "application/x-zip-compressed",
                "Content-Length": built.data.length,
                "Content-Disposition": "attachment; filename=" + built.name
            });
            res.end(built.data);
        })
        .catch(err => {
            if (err === 404) {
                res.status(404).end("Theme or builder not found");
            }
            else {
                Log.error(err, req);
                res.status(500).end("Internal server error");
            }
        });
});

router.get("/:id", function(req, res) {
    Database.models.Theme.findOne({_id: req.params.id})
        .then(theme => {
            if (!theme) {
                throw 404;
            }
            res.status(200).json(theme);
        })
        .catch(err => {
            if (err === 404) {
                res.status(404).end("Theme not found");
            }
            else {
                Log.error(err, req);
                res.status(500).end("Internal server error");
            }
        });
});

router.post("/:id", function(req, res) {
    increaseDownloadCounter_p(req.params.id)
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            if (err === 404) {
                res.status(404).end("Theme not found");
            }
            else {
                Log.error(err, req);
                res.status(500).end("Internal server error");
            }
        });
});

function increaseDownloadCounter_p(id) {
    return Database.models.Theme.findByIdAndUpdate({_id: id}, {$inc: {downloads: 1}})
        .then(theme => {
            if (!theme) {
                throw 404;
            }

            return {downloads: theme.downloads};
        });
}

module.exports = router;
