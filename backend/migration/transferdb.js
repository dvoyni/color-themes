var pg = require('pg');
var Database = require("../Database");
var fs = require("fs");

var sourceUrl = process.env.SOURCE;
var targetUrl = process.env.MONGO_URL;

process.on('uncaughtException', function (err) {
    console.log(err.stack, "\n", err.message);
});

var parseString = require('xml2js').parseString;

var ideaParser = {
    parse: function(file, callback) {
        parseString(file, function(err, theme) {
            if (err || !theme) {
                return callback();
            }

            var styles = {};

            var scheme = theme.scheme;
            if (!scheme) {
                return callback();
            }

            var colors = scheme.colors && scheme.colors[0];
            if (colors && colors.option) {
                colors.option.forEach(function(option) {
                    styles[option.$.name.replace(/\./g, "$")] = { color: option.$.value, simple: true };
                });
            }

            var attributes = scheme.attributes && scheme.attributes[0];
            if (attributes && attributes.option) {
                attributes.option.forEach(function(option) {
                    var style = {};
                    var value = option.value && option.value[0];
                    if (value.option) {
                        value.option.forEach(function(vo) {
                            var val = vo.$.value;
                            switch(vo.$.name) {
                                case "FONT_TYPE":
                                    style.bold = (val & 1) !== 0;
                                    style.italic = (val & 2) !== 0;
                                    break;
                                case "FOREGROUND":
                                    style.color = val;
                                    break;
                                case "BACKGROUND":
                                    style.backgroundColor = val;
                                    break;
                                case "ERROR_STRIPE_COLOR":
                                    style.markerColor = val;
                                    break;
                                case "EFFECT_TYPE":
                                    style.effectType = parseInt(val);
                                    break;
                                case "EFFECT_COLOR":
                                    style.effectColor = val;
                                    break;
                            }
                        });
                    }
                    styles[option.$.name.replace(/\./g, "$")] = style;
                });
            }


            callback(null, styles);
        });
    }
};

var parserList = [ideaParser];

var parsers = {
    parse: function(file, callback) {
        var results = [];
        parserList.forEach(function(parser) {
            parser.parse(file, function(err, styles) {
                if (err) {
                    throw err;
                }
                results.push(styles);

                if (results.length == parserList.length) {
                    callback(null, results.filter(function(styles) { return !!styles; })[0]);
                }
            });
        });
    }
};


Database.connect(targetUrl,  function(err, models) {
    pg.connect(sourceUrl, function(err, client, done) {
        if(err) {
            throw err;
        }
        Database.models.Theme.find({}).remove(function(err) {
            if(err) {
                throw err;
            }
            client.query("SELECT * FROM backend_theme WHERE elements <> '' ORDER BY id", null, function(err, result) {
                done();

                if(err) {
                    throw err;
                }
                var index = 0;

                var processedThemes = [];

                processRow(result.rows[index++]);

                function genCss(styles) {
                    Object.keys(styles).forEach(function(key) {
                        var item = styles[key];
                        var css = "";
                        if (item.bold) {
                            css += "font-weight: bold; ";
                        }
                        if (item.italic) {
                            css += "font-style: italic; ";
                        }
                        if (item.color) {
                            css += "color: #" + item.color + "; ";
                        }
                        if (item.backgroundColor) {
                            css += "background-color: #" + item.backgroundColor + "; ";
                        }
                        if (item.effectColor !== undefined) {
                            if (item.effectType === 1) {
                                css += "border-bottom: 1px solid #" + item.effectColor + "; ";
                            }

                            if (item.effectType === 2) {
                                css += "border-bottom: 2px solid #" + item.effectColor + "; ";
                            }
                            if (item.effectType === 3) {
                                css += "border-bottom: 1px solid #" + item.effectColor + "; ";   //TODO: this is should be wavy line
                            }
                            if (item.effectType === 4) {
                                css += "border: 1px solid #" + item.effectColor + "; ";
                            }
                            if (item.effectType === 5) {
                                css += "text-decoration: line-through; text-decoration-color: " + item.effectColor + "; ";
                            }
                            if (item.effectType === 6) {
                                css += "border-bottom: 1px dotted #" + item.effectColor + "; ";
                            }
                        }
                        item.css = css;
                    });
                }

                function processRow(row) {
                    if (!row) {
                        fs.writeFile("themes.json", JSON.stringify(processedThemes), function() {
                            process.exit();
                        });
                        return;
                    }
                    console.log("<" + index + " " + row.name);
                    function processTheme(styles) {
                        genCss(styles);

                        var themeData = {
                            title: row.name,
                            styles: styles,
                            downloads: row.downloads,
                            date: row.date,
                            author: row.author,
                            website: row.website,
                            comment: row.comment
                        };
                        processedThemes.push(themeData);

                        var theme = new Database.models.Theme(themeData);
                        theme.save(function(err) {
                            if (err) {
                                throw err;
                            }
                            console.log(">" + index + " " + theme.title);
                            processRow(result.rows[index++]);
                        });
                    }

                    if (row.archive) {
                        fs.readFile(row.archive, function(err, file) {
                            if (err) {
                                throw  err;
                            }
                            parsers.parse(file, function(err, styles) {
                                if (err) {
                                    throw err;
                                }
                                processTheme(styles);
                            });
                        });
                    }
                    else {
                        processTheme(row.elements.split('\n').
                            map(function(line) { return line.split('=');}).
                            map(function(item) {
                                var value = item[1];
                                if (value[0] !== '(') {
                                    value = '(None,None,' + value +',None,None,None,None)'
                                    var simple = true;
                                }
                                value = value.substring(1, value.length - 1);
                                value = value.split(',').map(function(s) { return s.trim(); });
                                item[1] = {};
                                if (value[0] === 'True') { item[1].bold = true; }
                                if (value[1] === 'True') { item[1].italic = true; }
                                if (value[2] !== 'None') { item[1].color = value[2]; }
                                if (value[3] !== 'None') { item[1].backgroundColor = value[3]; }
                                if (value[4] !== 'None') { item[1].markerColor = value[4]; }
                                if (value[5] !== 'None') { item[1].effectType = parseInt(value[5], 10); }
                                if (value[6] !== 'None') { item[1].effectColor = value[6]; }
                                if (simple) { item[1].simple = true; }
                                return item;
                            }).
                            reduce(function(styles, item) {
                                styles[item[0]] = item[1];
                                return styles;
                            }, {}));
                    }
                }
            });
        });
    });

});

