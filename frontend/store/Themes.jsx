import Request from "../core/Request";
import Application from "../core/Application";
import store from "./store";
import IndexActions from "./state/index";
import ThemeActions from "./state/theme";

export default class Themes {
    static increaseDowloadCounter(id) {
        Request.api("POST", `themes/${id}`);
    }

    static downloadAll(callback, progress) {
        Request.api("GET", "themes", {all: true}, (err, response) => {
            if (err) {
                return Application.showError(err);
            }

            callback(response.themes);
        }, progress);
    }
}

function requestThemes() {
    const {page, themesPerPage, search, order} = store.getState().index;

    return Request.api("GET", "themes", {
        offset: (page-1) * themesPerPage,
        count: themesPerPage,
        search: search,
        order: order
    }, (err, response) => {
        if (err) {
            return Application.showError(err);
        }

        store.dispatch(IndexActions.setThemes(response.themes, response.total));
    });
}

function requestTheme() {
    const {id} = store.getState().theme;

    Request.api("GET", `themes/${id}`, null, function(err, theme) {
        if (err) {
            return Application.showError(err);
        }

        store.dispatch(ThemeActions.setTheme(theme));
    });
}

var prevState = {};
store.subscribe(function() {
    var state = store.getState();
    var prev = prevState;
    prevState = state;
    switch (state.currentView) {
        case "index":
            var oldIndex = prev.index || {};
            var index = state.index;
            var themesChanged = (prev.currentView !== state.currentView) ||
                (oldIndex.page !== index.page) ||
                (oldIndex.search !== index.search) ||
                (oldIndex.order !== index.order);

            if (themesChanged) {
                store.dispatch(IndexActions.setThemes([], 0));
                requestThemes();
            }
            break;

        case "theme":
            var oldTheme = prev.theme || {};
            var theme = state.theme;
            var themeChanged = (prev.currentView !== state.currentView) ||
                (oldTheme.id !== theme.id);

            if (themeChanged) {
                store.dispatch(ThemeActions.setTheme(null));
                requestTheme();
            }
            break;
    }
});
