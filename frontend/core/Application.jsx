import React, {Component} from "react";
import {Provider, connect} from "react-redux";
import ReactDOM from "react-dom";
import QueryParameters from "../utils/QueryParameters";
import store from "../store/store";
import CurrentViewActions from "../store/state/currentView"

var views = {},
    configValues = {},
    errorHandler = function() {
        alert.apply(window, arguments);//TODO: fix ugly alert
    };

export default class Application extends Component {
    render() {
        var viewName = this.props.currentView;
        var View = views[viewName];
        if (View) {
            var viewProps = Object.assign({}, this.props[viewName]);
            if (View.extractAdditionalProps) {
                viewProps = Object.assign(viewProps, View.extractAdditionalProps(this.props));
            }

            return <View {...viewProps} key={viewName}/>
        }
        else {
            return <div></div>;
        }
    }

    static run() {
        document.body.innerHTML = "";
        var root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.appendChild(root);

        window.addEventListener("popstate", Application.route);

        Application.route();

        ReactDOM.render(
            <Provider store={store}>
                <WrappedApp />
            </Provider>,
            document.getElementById("root"));
    }

    static route(event) {
        var params = QueryParameters.parse(location.search, false, true);
        var view = params.view || "index";
        delete params.view;
        store.dispatch(CurrentViewActions.showView(view, params, !!event));
    }

    static registerView(view) {
        views[view.uri] = view;
    }

    static makeViewUrl(name, params) {
        var query = Object.assign({view: name}, params);
        return "?" + QueryParameters.stringify(query);
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
        if (err instanceof Error) {
            console.log(err);
        }
        else {
            if (errorHandler) {
                errorHandler(err);
            }
        }
    }
}

var WrappedApp = connect(function(state) {
    return state;
})(Application);
