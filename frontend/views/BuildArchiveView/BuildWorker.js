import BuildUtils from "../../builders/BuilderUtils";

addEventListener("message", (e) => {
    BuildUtils.buildAll_p(e.data.themes, e.data.builder, p => postMessage({
            type: "progress",
            value: p
        }))
        .then(a => postMessage({
            type: "done",
            archive: a
        }));
});
