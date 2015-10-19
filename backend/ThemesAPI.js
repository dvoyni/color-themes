var express = require("express");
var router = express.Router();
var Database = require("./Database");
var Log = require("./Log");

router.get("/", function(req, res) {
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
    Database.models.Theme
        .findByIdAndUpdate({_id: req.params.id}, {$inc: {downloads: 1}}, function(err, theme) {
            if (err) {
                Log.error(data.err);
                res.status(500).end("Database error");
                return;
            }
            if (!theme) {
                res.status(404).end("Not found");
                return;
            }
            res.status(200).json({downloads: theme.downloads});
        });
});

module.exports = router;
