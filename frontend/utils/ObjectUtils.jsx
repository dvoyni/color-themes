export default class ObjectUtils {
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
