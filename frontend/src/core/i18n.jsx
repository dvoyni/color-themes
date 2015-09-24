var StringUtils = require("utils/StringUtils");

function i18n(text) {
    if (arguments.length === 1) {
        return text;
    }
    else {
        var args = Array.prototype.slice.call(arguments);
        args[0] = i18n(text);
        return StringUtils.format.apply(null, args);
    }
}

module.exports = i18n;
