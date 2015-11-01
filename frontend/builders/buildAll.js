var Builders = require("./Builders");
var JSZip = require("jszip");

module.exports = function(themes, builderName, done, progress, contentType) {
    var builder = Builders[builderName];

    var compiled = themes.map((theme, index) => {
        if (progress) {
            progress(index / (themes.length * 2));
        }
        return builder.build(theme, "uint8array");
    });

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

    done(archive);
};
