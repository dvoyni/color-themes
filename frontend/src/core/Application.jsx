var React = require("react");
var QueryParameters = require("utils/QueryParameters");
var ObjectUtils =require("utils/ObjectUtils");

var views = {},
    currentView,
    configValues = {},
    errorHandler = function() {alert.apply(window, arguments);};

var Application = {
    init() {
        window.addEventListener("popstate", function() {
            Application.route(QueryParameters.parse(location.search, false, true));
        });
    },

    registerView(view, constraints) {
        views[view.uri] = {view: view, constraints: constraints || []};
    },

    showView(name, params) {
        window.location.href = Application.makeViewUrl(name, params);
    },

    makeViewUrl(name, params) {
        var url = "?view=" + name;
        if (params) {
            url += "&" + QueryParameters.stringify(params);
        }
        return url;
    },

    route(params, saveHistory, saveScroll) {
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
                var title = View.getTitle && View.getTitle();
                if (title) {
                    Application.setTitle(View.getTitle());
                }

                if (saveHistory) {
                    var filteredParams = Object.keys(params).
                        filter(key => key.indexOf("__") !== 0).
                        reduce((fp,key) => {fp[key] = params[key]; return fp;}, {});

                    history.pushState(null, title, "?" + QueryParameters.stringify(filteredParams));
                }

                currentView = <View {...params} key={Date.now()}/>;

                React.render(currentView, window.document.body);
            }

            if (!saveScroll) {
                document.body.scrollTop = 0;
            }
        }
    },

    getCurrentView() {
        return currentView;
    },

    setConfigValue(key, value) {
        configValues[key] = value;
    },

    getConfigValue(key) {
        return configValues[key];
    },

    setTitle(string) {
        document.title = string;
    },

    setErrorHandler(fn) {
        errorHandler = fn;
    },

    showError(err) {
        if (errorHandler) {
            errorHandler(err);
        }
    }
};

module.exports = Application;
