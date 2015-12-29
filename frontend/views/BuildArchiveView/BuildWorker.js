import BuildUtils from "../../builders/BuilderUtils";

addEventListener("message", (event) => {
    BuildUtils.buildAll_p(event.data.themes, event.data.builder, progress => postMessage({
            type: "progress",
            value: progress
        }))
        .then(compiled => postMessage({
            type: "done",
            compiled: compiled
        }));
});
