var path = require("path");

var debug = !!process.env.DEBUG;

module.exports = {
    entry: "main.jsx",
    devtool: debug && 'source-map',
    output: {
        path: path.join(__dirname, "static/bundle"),
        filename: "scripts.js",
        publicPath: "/bundle/"
    },
    module: {
        loaders: [
            { test: /\.jsx?$/, loader: "babel" },
            { test: /\.less$/, loader: "style!css!less" },
            { test: /\.(ttf|svg|png)$/, loader : "file-loader" }
        ]
    },
    resolve: {
        root: [path.join(__dirname, "frontend/src"), path.join(__dirname, "frontend")],
        extensions: ["", ".js", ".jsx", ".less"]
    },
    externals: {
        "react": "React",
        "jszip": "JSZip"
    }
};
