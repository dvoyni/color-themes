var defaultUserState = {
    name: "",
    email: "",
    updated: false,
    pending: true,
    isPremium: false
};

export var UserActionType = {
    SET_USER: "SET_USER",
    SET_PENDING: "SET_PENDING"
}

export default class UserActions {
    static setUser(user) {
        const {name, email, isPremium} = (user || {});
        return { type: UserActionType.SET_USER, name, email, isPremium};
    }

    static setPending() {
        return {type: UserActionType.SET_PENDING};
    }
}

export function user(state = defaultUserState, action) {
    switch (action.type) {
        case UserActionType.SET_USER:
            return {
                name: action.name || "",
                email: action.email || "",
                updated: true,
                pending: false,
                isPremium: !!action.isPremium
            };
        case UserActionType.SET_PENDING:
            return Object.assign({}, state, {pending: true});
        default:
            return state;
    }
}
