var apiFn = null;

var Request = {
    run(url, method, headers, data, callback, context) {
        var xhr = new XMLHttpRequest();
        if (headers) {
            Object.keys(headers).forEach(name => xhr.setRequestHeader(name, headers[name]));
        }

        xhr.open(method, url, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    callback.call(context, null, xhr.responseText);
                }
                else {
                    callback.call(context, xhr.responseText);
                }
            }
        };

        xhr.send(data);
    },

    api(method, request, params, callback, context) {
        if (apiFn) {
            apiFn.apply(null, arguments);
        }
    },

    setApiFn(fn) {
        apiFn = fn;
    }
};

module.exports = Request;
