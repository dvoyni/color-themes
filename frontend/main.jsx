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

import Promise from "es6-promise";

import "./main.less";

// Google Analytics
(function(i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function() {
            (i[r].q = i[r].q || []).push(arguments)
        }, i[r].l = 1 * new Date();
    a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
ga('create', 'UA-44640459-2', 'auto');

//IE support
if (!Object.assign) {
    Object.assign = function(object, ...params) {
        return params.reduce((o, p) => (p && Object.keys(p).forEach(k => o[k] = p[k]) && o) || o, object);
    }
}

if (!window.Promise) {
    Promise.polyfill();
}

Request.setApiFn(apiFn_p);

Application.registerView(IndexView);
Application.registerView(HelpView);
Application.registerView(ThemeView);
Application.registerView(UploadView);
Application.registerView(DownloadAllView);
Application.registerView(BuildArchiveView);

User.update();

Request.api_p("GET", "config")
    .then(config => {
        Object.keys(config).forEach(key => Application.setConfigValue(key, config[key]));
        Application.run();
    })
    .catch(err => Application.showError(err));

function apiFn_p(method, request, params, progress) {
    if (params && (method === "GET")) {
        var query = Object.keys(params)
            .map(p => encodeURIComponent(p) + "=" + encodeURIComponent(params[p]))
            .join("&");
        if (query) {
            request += "?" + query;
        }
        params = null;
    }

    if (params) {
        params = JSON.stringify(params);
    }

    var headers = {"Content-Type": "application/json"};

    return Request.run_p("/api/" + request, method, headers, params, progress)
        .then(data => data && JSON.parse(data));
}
