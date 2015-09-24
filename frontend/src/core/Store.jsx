var fakeStorage = {};

var Store = {
    getItem(key) {
        var value;
        if (localStorage) {
            value = JSON.parse(localStorage.getItem(key));
        }
        else {
            value = fakeStorage[key];
        }
        return value;
    },

    setItem(key, value) {
        if (localStorage) {
            localStorage.setItem(key, JSON.stringify(value))
        }
        else {
            fakeStorage[key] = value;
        }
    },

    removeItem(key) {
        if (localStorage) {
            localStorage.removeItem(key)
        }
        else {
            delete fakeStorage[key];
        }
    }
};

module.exports = Store;
