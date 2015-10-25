var defaultCurrentViewState = null;

export var CurrentViewActionType = {
    SHOW_VIEW: "SHOW_VIEW"
}

export default class CurrentViewActions {
    static showView(view, params, dontSaveHistory) {
        return {type: CurrentViewActionType.SHOW_VIEW, view, params, dontSaveHistory};
    }
}

export function currentView(state = defaultCurrentViewState, action) {
    switch (action.type) {
        case CurrentViewActionType.SHOW_VIEW:
            return action.view;

        default:
            return state;
    }
}
