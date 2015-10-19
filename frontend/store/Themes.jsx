import Request from "../core/Request";
import Application from "../core/Application";

export default class Themes {
    static themesPerPage = 40;

    static getPage(page, search, order, store) {
        return Request.api("GET", "themes", {
            offset: page * this.themesPerPage,
            count: this.themesPerPage,
            search: search,
            order: order
        }, (err, response) => {
            if (err) {
                return Application.showError(err);
            }

            store.clear();
            store.add(response.themes);
            store.setAvailable(response.total / this.themesPerPage +
                Math.min(1, response.total % this.themesPerPage));
        });
    }

    static getTheme(id, callback) {
        Request.api("GET", `themes/${id}`, null, function(err, theme) {
            if (err) {
                return Application.showError(err);
            }
            callback(theme);
        });
    }

    static increaseDowloadCounter(id) {
        Request.api("POST", `themes/${id}`);
    }
}
