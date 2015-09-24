var ObjectUtils = {
    clone(object, deep) {
        var result;
        if (ObjectUtils.isObject(object)) {
            result = {};
            Object.keys(object).forEach(key => result[key] = deep ? ObjectUtils.clone(object[key], deep) : object[key]);
        }
        else if (ObjectUtils.isArray(object)) {
            if (deep) {
                result = object.map(item => ObjectUtils.clone(item, deep));
            }
            else {
                result = object.slice(0);
            }
        }
        else {
            result = object;
        }
        return result;
    },

    isObject(object) {
        return Object.prototype.toString.apply(object) === "[object Object]";
    },

    isArray(object) {
        return Object.prototype.toString.apply(object) === "[object Array]";
    },

    isNumber(object) {
        return Object.prototype.toString.apply(object) === "[object Number]";
    },

    isFunction(object) {
        return Object.prototype.toString.apply(object) === "[object Function]";
    }
};

module.exports = ObjectUtils;
