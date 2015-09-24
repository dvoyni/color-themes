var StringUtils = {
    format(pattern) {
        var args = arguments;
        return pattern.replace(/(\{\d\})/g, function(index) {
            return args[1 + parseInt(index.substring(1, index.length - 1), 10)];
        });
    }
};

module.exports = StringUtils;
