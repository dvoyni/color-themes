export default class ObjectUtils {
    static clone(object, deep) {
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
    }

    static isObject(object) {
        return Object.prototype.toString.apply(object) === "[object Object]";
    }

    static isArray(object) {
        return Object.prototype.toString.apply(object) === "[object Array]";
    }

    static isNumber(object) {
        return Object.prototype.toString.apply(object) === "[object Number]";
    }

    static isFunction(object) {
        return Object.prototype.toString.apply(object) === "[object Function]";
    }
}
