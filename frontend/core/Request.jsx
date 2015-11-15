var apiFn = null;

export default class Request {
    static run_p(url, method, headers, data, progress) {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.open(method, url, true);

            if (headers) {
                Object.keys(headers).forEach(name => xhr.setRequestHeader(name, headers[name]));
            }

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(xhr.responseText);
                    }
                    else {
                        var err = new Error(xhr.responseText);
                        err.status = xhr.status;
                        reject(err);
                    }
                }
            };

            if (progress) {
                xhr.onprogress = (e) => progress(e.loaded / e.total, e.loaded, e.total);
            }

            xhr.send(data);
        });
    }

    static api_p(method, request, params, progress) {
        if (apiFn) {
            return apiFn.apply(null, arguments);
        }
        return Promise.reject(new Error("Api funtion is not defened"));
    }

    static setApiFn(fn) {
        apiFn = fn;
    }
}
