var express = require("express");
var router = express.Router();
var Database = require("./Database");
var Log = require("./Log");
var Builders = require("../frontend/builders/Builders.js");

function getAllThemes(req, res) {
    if (req.session.user && req.session.user.isPremium) {
        Database.models.Theme.find({}, function(err, themes) {
            if (err) {
                Log.error(data.err);
                res.status(500).end("Database error");
                return;
            }
            res.status(200).json({
                themes: themes,
                total: themes.length
            });
        });
    }
    else {
        res.status(503).end("Forbidden");
    }
}

function getThemesPage(req, res) {
    var options = req.query;

    var offset = parseInt(options.offset || 0),
        count = parseInt(options.count || 0),
        search = options.search || "",
        order = options.order === "popular" ? "downloads" : "date",
        direction = -1,
        sort = {};

    sort[order] = direction;

    var query = {};
    if (search) {
        query = {title: new RegExp(search, "gi")};
    }
    var data = {};

    Database.models.Theme
        .find(query)
        .count((err, count) => {
            if (err) {
                data.err = err;
            }
            data.total = count;
            check();
        });

    Database.models.Theme
        .find(query)
        .sort(sort)
        .skip(offset)
        .limit(count)
        .exec((err, themes) => {
            if (err) {
                data.err = err;
            }
            data.themes = themes;
            check();
        });

    function check() {
        if (data.err) {
            Log.error(data.err);
            res.status(500).end("Database error");
            data.err = null;
            return;
        }
        if ((data.total !== undefined) && data.themes) {
            res.status(200).json(data);
        }
    }
}

router.get("/", function(req, res) {
    if (req.query.all) {
        getAllThemes(req, res);
    }
    else {
        getThemesPage(req, res);
    }
});

router.get("/:id/compiled/:builder", function(req, res) {
    Database.models.Theme
        .findOne({_id: req.params.id})
        .exec((err, theme) => {
            if (err) {
                Log.error(data.err);
                res.status(500).end("Database error");
                return;
            }
            if (!theme) {
                res.status(404).end("Theme not found");
                return;
            }
            var builder = Builders[req.params.builder];
            if (!builder) {
                res.status(404).end("Builder not found");
                return;
            }
            var built = builder.build(theme, "nodebuffer");
            increaseDownloadCounter(function(err, data) {
                if (err) {
                    res.status(err).end(data);
                    return;
                }
                res.writeHead(200, {
                    "Content-Type": "application/x-zip-compressed",
                    "Content-Length": built.data.length,
                    "Content-Disposition": "attachment; filename=" + built.name
                });
                res.end(built.data);
            });
        });
});

router.get("/:id", function(req, res) {
    Database.models.Theme
        .findOne({_id: req.params.id})
        .exec((err, theme) => {
            if (err) {
                Log.error(data.err);
                res.status(500).end("Database error");
                return;
            }
            if (!theme) {
                res.status(404).end("Not found");
                return;
            }
            res.status(200).json(theme);
        });
});

router.post("/:id", function(req, res) {
    increaseDownloadCounter(function(err, data) {
        if (err) {
            res.status(err).end(data);
            return;
        }

        res.status(200).json(data);
    });
});

function increaseDownloadCounter(callback) {
    Database.models.Theme
        .findByIdAndUpdate({_id: req.params.id}, {$inc: {downloads: 1}}, function(err, theme) {
            if (err) {
                Log.error(data.err);
                callback(500, "Database error");
                return;
            }
            if (!theme) {
                callback(404, "Not found");
                return;
            }
            callback(null, {downloads: theme.downloads});
        });
}

module.exports = router;
