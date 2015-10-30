var apiFn = null;

export default class Request {
    static run(url, method, headers, data, callback, progress) {
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

        if (progress) {
            xhr.onprogress = (e) => progress(e.loaded / e.total, e.loaded, e.total);
        }

        xhr.send(data);
        return xhr;
    }

    static api(method, request, params, callback, progress) {
        if (apiFn) {
            return apiFn.apply(null, arguments);
        }
        return null;
    }

    static setApiFn(fn) {
        apiFn = fn;
    }
}
