var defaultThemeState = {
    id: "",
    theme: null
};

export var ThemeActionType = {
    SET_THEME: "SET_THEME"
}

export default class ThemeActions {
    static setTheme(theme) {
        return { type: ThemeActionType.SET_THEME, theme: theme};
    }
}

export function theme(state = defaultThemeState, action) {
    switch (action.type) {
        case ThemeActionType.SET_THEME:
            return Object.assign({}, state, {theme: action.theme});
        default:
            return state;
    }
}
