var JSZip = require("jszip");
var parseString = require('xml2js').parseString;
var BuilderUtils = require('./BuilderUtils');

var f = function(text, params) {
    return text.replace(/(\$\{\w+\})/g, function(index) {
        return params[index.substring(2, index.length - 1)];
    });
}

var options = {
    font: "FONT_TYPE",
    color: "FOREGROUND",
    backgroundColor: "BACKGROUND",
    markerColor: "ERROR_STRIPE_COLOR",
    effectType: "EFFECT_TYPE",
    effectColor: "EFFECT_COLOR"
};

var Idea = {
    isFileSupported_p: function(file) {
        var ext = file.name.split(".").pop();
        return Promise.resolve(ext === "xml" || ext === "icls");
    },

    parseStyles_p: function(fileName, fileContent) {
        var ext = fileName.split(".").pop();
        var supported = ext === "xml" || ext === "icls";
        if (!supported) {
            return Promise.resolve(null);
        }

        return new Promise((resolve, reject) => {
            parseString(fileContent, function(err, theme) {
                if (err || !theme) {
                    return resolve(null);
                }

                var styles = {};

                var scheme = theme.scheme;
                if (!scheme) {
                    return resolve(null);
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
                        var value = option.value && option.value[0];
                        if (value) {
                            var style = {};

                            if (value.option) {
                                value.option.forEach(function(vo) {
                                    var val = vo.$.value;
                                    switch (vo.$.name) {
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
                        }
                    });
                }

                if (styles.length === 0) {
                    return resolve(null);
                }

                BuilderUtils.fillCss(styles);
                resolve(styles);
            });
        });
    },

    build_p: function(theme, type) {
        var xml =
            Array.prototype.concat.call(
                [
                    '<?xml version="1.0" encoding="UTF-8"?>',
                    f('<scheme name="${title}" version="1" parent_scheme="Default">', {title: theme.title}),
                    '\t<option name="LINE_SPACING" value="1.0" />',
                    '\t<option name="EDITOR_FONT_SIZE" value="12" />',
                    '\t<option name="EDITOR_FONT_NAME" value="Menlo" />',
                    '\t<colors>'
                ],
                Object.keys(theme.styles).
                filter(name => theme.styles[name].simple).
                map(name => f('\t\t<option name="${name}" value="${value}" />',
                    {name: name, value: theme.styles[name].color})),
                [
                    '\t</colors>',
                    '\t<attributes>'
                ],
                Object.keys(theme.styles).
                filter(name => !theme.styles[name].simple).
                map(name => {
                    var style = theme.styles[name];
                    style.font = (style.bold ? 1 : 0) + (style.italic ? 2 : 0);

                    return Array.prototype.concat.call(
                        [
                            f('\t\t<option name="${name}">', {name: name}),
                            '\t\t\t<value>'
                        ],
                        Object.keys(options).
                        filter(option => style[option]).
                        map(option => f('\t\t\t\t<option name="${name}" value="${value}" />',
                            {name: options[option], value: style[option]})),
                        [
                            '\t\t\t</value>',
                            '\t\t</option>'
                        ]
                    ).join("\n");
                }),
                [
                    '\t</attributes>',
                    '</scheme>'
                ]
            ).join("\n");

        var descriptor = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<application>',
            '\t<component name="EditorColorsManagerImpl">',
            '\t\t<option name="USE_ONLY_MONOSPACED_FONTS" value="true" />',
            f('\t\t<global_color_scheme name="${name}" />', {name: theme.title}),
            '\t</component>',
            '</application>'].join("\n");

        function safe(name) {
            return encodeURIComponent(name).replace(/\%20/g, " ");
        }

        var zip = new JSZip();
        zip.file("IntelliJ IDEA Global Settings", "");
        zip.file("options/colors.scheme.xml", descriptor);
        zip.file(f("colors/${title}.xml", {title: safe(theme.title)}), xml);

        var archive = zip.generate({
            type: type || "blob",
            mimeType: "application/x-zip-compressed",
            compression: "DEFLATE"
        });

        return Promise.resolve({
            name: safe(theme.title) + ".jar",
            data: archive
        });
    },

    instructions: function() {
        return 'To export theme click <em>File</em> | <em>Export Settings...</em> in the menu.<br/> Unpack created <abbr title="You can rename file to zip and unpack it in usual way">.jar</abbr> file and find <em>.icls</em> or <em>.xml</em> file in the <em>colors</em> directory.';
    }
};

module.exports = Idea;
