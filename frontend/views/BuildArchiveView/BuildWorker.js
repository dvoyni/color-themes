import buildAll from "../../builders/buildAll";

addEventListener("message", (e) => {
    buildAll(e.data.themes, e.data.builder,
        a => postMessage({type: "done", archive: a}),
        p => postMessage({type: "progress", value: p}));
});
