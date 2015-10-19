var fakeStorage = {};

export default class Settings {
    static getItem(key) {
        var value;
        if (localStorage) {
            value = JSON.parse(localStorage.getItem(key));
        }
        else {
            value = fakeStorage[key];
        }
        return value;
    }

    static setItem(key, value) {
        if (localStorage) {
            localStorage.setItem(key, JSON.stringify(value))
        }
        else {
            fakeStorage[key] = value;
        }
    }

    static removeItem(key) {
        if (localStorage) {
            localStorage.removeItem(key)
        }
        else {
            delete fakeStorage[key];
        }
    }
}
