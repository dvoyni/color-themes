import React from "react";
import ReactDOM from "react-dom";
import QueryParameters from "utils/QueryParameters";
import ObjectUtils from "utils/ObjectUtils";

var views = {},
    currentView,
    configValues = {},
    errorHandler = function() {alert.apply(window, arguments);};

export default class Application {
    static init() {
        var root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.appendChild(root);
        window.addEventListener("popstate", function() {
            Application.route(QueryParameters.parse(location.search, false, true));
        });
    }

    static registerView(view) {
        views[view.uri] = view;
    }

    static showView(name, params) {
        window.location.href = Application.makeViewUrl(name, params);
    }

    static makeViewUrl(name, params) {
        var url = "?view=" + name;
        if (params) {
            url += "&" + QueryParameters.stringify(params);
        }
        return url;
    }

    static route(params, saveHistory, saveScroll) {
        if (!params) {
            params = QueryParameters.parse(window.location.search)
        }

        var View = views[params.view || "index"];
        if (View) {
            var title = View.title;
            if (title) {
                Application.setTitle(title);
            }

            if (saveHistory) {
                var filteredParams = Object.keys(params).
                filter(key => key.indexOf("__") !== 0).
                reduce((fp, key) => {
                    fp[key] = params[key];
                    return fp;
                }, {});

                history.pushState(null, title, "?" + QueryParameters.stringify(filteredParams));
            }

            currentView = <View {...params} key={Date.now()}/>;

            ReactDOM.render(currentView, document.getElementById("root"));

            if (!saveScroll) {
                document.body.scrollTop = 0;
            }
        }
    }

    static getCurrentView() {
        return currentView;
    }

    static setConfigValue(key, value) {
        configValues[key] = value;
    }

    static getConfigValue(key) {
        return configValues[key];
    }

    static setTitle(string) {
        document.title = string;
    }

    static setErrorHandler(fn) {
        errorHandler = fn;
    }

    static showError(err) {
        if (errorHandler) {
            errorHandler(err);
        }
    }
}
