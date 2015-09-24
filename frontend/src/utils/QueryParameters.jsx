var QueryParameters = {
    parse(query) {
        var params = {};
        if (query.length > 0) {
            if (query[0] === "?") {
                query = query.substr(1);
            }
            query.split("&").forEach(param => {
                var parts = param.split("=");
                params[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
            });
        }
        return params;
    },

    stringify(params) {
        return Object.keys(params).
            map(key => encodeURIComponent(key) + "=" + encodeURIComponent(params[key])).
            join("&");
    }
};

module.exports = QueryParameters;
