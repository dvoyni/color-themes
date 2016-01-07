import CurrentViewActions from "./currentView";
import store from "../store";

var defaultIndexState = {
    page: 1,
    order: "popular",
    search: "",
    layout: "Generic",
    themes: [],
    totalThemes: 0,
    themesPerPage: 56
};

export var IndexActionType = {
    SET_THEMES: "SET_THEMES"
}

function navigate(params) {
    const {page, order, search, layout} = store.getState().index;
    var merged = Object.assign({page, order, search, layout}, params);
    return CurrentViewActions.showView("index", merged);
}

export default class IndexActions {
    static setOrder(order) {
        return navigate({order});
    }
    static setSearch(search) {
        return navigate({search});
    }
    static setLayout(layout) {
        return navigate({layout});
    }
    static setThemes(themes, total) {
        return {type: IndexActionType.SET_THEMES, themes: themes, total: total};
    }
}

export function index(state = defaultIndexState, action) {
    switch (action.type) {
        case IndexActionType.SET_THEMES:
            return Object.assign({}, state, {themes: action.themes, totalThemes: action.total});

        default:
            return state;
    }
}
