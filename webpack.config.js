var path = require("path");
var fs = require("fs");
var Clean = require("clean-webpack-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var debug = !!process.env.DEBUG;

module.exports = {
    entry: {
        scripts: "main.jsx"
    },
    devtool: debug && "source-map",
    output: {
        path: path.join(__dirname, "build"),
        filename: "[name].[chunkhash].js"
    },
    module: {
        loaders: [
            { test: /\.jsx?$/, loader: "babel?stage=0", exclude: /node_modules/ },
            { test: /\.less$/, loader: "style!css!less" },
            { test: /\.(ttf|svg|png)$/, loader : "file-loader?name=[hash].[ext]" }
        ]
    },
    resolve: {
        root: [
            path.join(__dirname, "frontend"),
            path.join(__dirname, "node_modules")],
        extensions: ["", ".js", ".jsx", ".less"]
    },
    plugins: [
        new Clean(["build"], __dirname),
        new HtmlWebpackPlugin({
            title: "Color Themes",
            filename: "index.html",
            template: path.join(__dirname, "frontend/index.html"),
            favicon: path.join(__dirname, "frontend/favicon.png")
        })
    ]
};
