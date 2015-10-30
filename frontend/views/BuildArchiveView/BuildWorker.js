import JSZip from "jszip";
import Builders from "../../builders/Builders";

addEventListener("message", (e) => {
    var themes = e.data.themes;
    var builder = Builders[e.data.builder];

    var compiled = themes.map((theme, index) => {
        postMessage({type: "progress", value: index / (themes.length * 2)});
        return builder.build(theme, "uint8array");
    });

    var zip = new JSZip();
    compiled.forEach((compiled, index) => {
        postMessage({type: "progress", value: .5 + index / (themes.length * 2)});
        zip.file(compiled.name, compiled.data);
    })

    var archive = zip.generate({
        type: "blob",
        mimeType: "application/x-zip-compressed",
        compression: "STORE"
    });

    postMessage({type: "done", archive: archive});
});
