import Application from "./core/Application";
import Request from "./core/Request";
import CurrentViewActions from "./store/state/currentView";
import store from "./store/store";
import User from "./store/User";

import IndexView from "views/IndexView/IndexView";
import HelpView from "views/HelpView/HelpView";
import ThemeView from "views/ThemeView/ThemeView";
import UploadView from "views/UploadView/UploadView";
import DownloadAllView from "views/DownloadAllView/DownloadAllView";
import BuildArchiveView from "views/BuildArchiveView/BuildArchiveView";

import "./main.less";

Request.setApiFn(apiFn);

Application.registerView(IndexView);
Application.registerView(HelpView);
Application.registerView(ThemeView);
Application.registerView(UploadView);
Application.registerView(DownloadAllView);
Application.registerView(BuildArchiveView);

User.update();

Request.api("GET", "config", null, function(err, config) {
    Object.keys(config).forEach(key => Application.setConfigValue(key, config[key]));
    Application.run();
});

function apiFn(method, request, params, callback, progress) {
    if (params && (method === "GET")) {
        var query = Object.keys(params)
            .map(p => encodeURIComponent(p) + "=" + encodeURIComponent(params[p]))
            .join("&");
        if (query) {
            request += "?" + query;
        }
        params = null;
    }
    return Request.run("/api/" + request, method,
        {"Content-Type": "application/json"},
        params && JSON.stringify(params),
        callback && function(err, data) {
            callback.call(null, err, data && JSON.parse(data));
        }, progress);
}
