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

    static registerView(view, constraints) {
        views[view.uri] = {view: view, constraints: constraints || []};
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

        var viewInfo = views[params.view || "index"];
        if (viewInfo) {
            var constraint = viewInfo.constraints.
                map(constraint => constraint()).
                filter(constraint => !!constraint)[0];

            if (constraint) {
                if (typeof constraint === "string") {
                    Application.showView(constraint);
                }
                else {
                    Application.showView(constraint.view, constraint.params);
                }
            }
            else {
                var View = viewInfo.view;
                var title = View.title;
                if (title) {
                    Application.setTitle(title);
                }

                if (saveHistory) {
                    var filteredParams = Object.keys(params).
                        filter(key => key.indexOf("__") !== 0).
                        reduce((fp,key) => {fp[key] = params[key]; return fp;}, {});

                    history.pushState(null, title, "?" + QueryParameters.stringify(filteredParams));
                }

                currentView = <View {...params} key={Date.now()}/>;

                ReactDOM.render(currentView, document.getElementById("root"));
            }

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
