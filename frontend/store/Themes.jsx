import Request from "../core/Request";
import Application from "../core/Application";
import store from "./store";
import IndexActions from "./state/index";
import ThemeActions from "./state/theme";
import i18n from "../core/i18n";

export default class Themes {
    static increaseDowloadCounter(id) {
        Request.api_p("POST", `themes/${id}`, {id: id});
    }

    static downloadAll_p(progress) {
        return Request.api_p("GET", "themes", {all: true}, progress)
            .then(response => response.themes);
    }

    static uploadTheme_p(title, styles, description) {
        return Request.api_p("POST", "themes", {title, styles, description})
            .catch(err => {
                var code = err.status;
                if (code === 400) {
                    throw i18n("Not all required fields were filled or user no logged in");
                }
                else if (code == 403) {
                    throw i18n("Theme with given name already exists");
                }
                throw i18n("Unknown error occured");
            });
    }
}

function requestThemes() {
    const {page, themesPerPage, search, order} = store.getState().index;

    Request.api_p("GET", "themes", {
            offset: (page - 1) * themesPerPage,
            count: themesPerPage,
            search: search,
            order: order
        })
        .then(response => store.dispatch(IndexActions.setThemes(response.themes, response.total)))
        .catch(err => Application.showError(err));
}

function requestTheme() {
    const {id} = store.getState().theme;

    Request.api_p("GET", `themes/${id}`)
        .then(theme => store.dispatch(ThemeActions.setTheme(theme)))
        .catch(err => Application.showError(err));
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
