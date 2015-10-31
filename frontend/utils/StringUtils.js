var StringUtils = {
    format: function(pattern, params) {
        return pattern.replace(/(\$\{\w+\})/g, function(index) {
            return params[index.substring(2, index.length - 1)];
        });
    }
};

module.exports = StringUtils;
