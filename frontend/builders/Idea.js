var JSZip = require("jszip");
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
    parse: function(file) {

    },

    /*
     Possible values for type :
     base64: the result will be a string, the binary in a base64 form.
     string : the result will be a string in "binary" form, using 1 byte per char (2 bytes).
     uint8array : the result will be a Uint8Array containing the zip. This requires a compatible browser.
     arraybuffer : the result will be a ArrayBuffer containing the zip. This requires a compatible browser.
     blob (default): the result will be a Blob containing the zip. This requires a compatible browser.
     nodebuffer : the result will be a nodejs Buffer containing the zip. This requires nodejs.
     */
    build: function(theme, type) {
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

        return {
            name: safe(theme.title) + ".jar",
            data: archive
        };
    }
};

module.exports = Idea;
