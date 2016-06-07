var Builders = require("./Builders");
var JSZip = require("jszip");

var BuilderUtils = {
    fillCss(styles) {
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
                    css += "border-bottom: 1px solid #" + item.effectColor + "; ";   //TODO: this one should be wavy line
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
    },

    buildAll_p(themes, builderName, progress, contentType) {
        var builder = Builders[builderName];

        if (builder.buildAll_p) {
            return builder.buildAll_p(themes, progress, contentType);
        }

        return Promise.all(themes.map((theme, index) => {
                if (progress) {
                    progress(index / (themes.length * 2));
                }
                return builder.build_p(theme, "uint8array");
            }))
            .then(compiled => {

                var zip = new JSZip();
                compiled.forEach((compiled, index) => {
                    if (progress) {
                        progress(.5 + index / (themes.length * 2));
                    }
                    zip.file(compiled.name, compiled.data);
                })

                var archive = zip.generate({
                    type: contentType || "blob",
                    mimeType: "application/x-zip-compressed",
                    compression: "STORE"
                });

                return {
                    data: archive,
                    name: "all-color-themes.zip"
                };
            });
    }

};

module.exports = BuilderUtils;
