var apiFn = null;

export default class Request {
    static run(url, method, headers, data, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url, true);

        if (headers) {
            Object.keys(headers).forEach(name => xhr.setRequestHeader(name, headers[name]));
        }

        if (callback) {
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        callback(null, xhr.responseText);
                    }
                    else {
                        callback(xhr.responseText, xhr.status);
                    }
                }
            };
        }

        xhr.send(data);
        return xhr;
    }

    static api(method, request, params, callback) {
        if (apiFn) {
            return apiFn.apply(null, arguments);
        }
        return null;
    }

    static setApiFn(fn) {
        apiFn = fn;
    }
}
