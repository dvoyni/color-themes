var React = require("react");

var Themes = {
    isUpdateRequired() {
        var themes = localStorage.getItem("themes");
        if (!themes) {
            return true;
        }

        var updateTime = localStorage.getItem("update-time");
        if (!updateTime) {
            return true;
        }

        var delta = (Date.now() - parseInt(updateTime)) / 1000 / 60 / 60;
        return delta >= 1;
    },

    getThemes() {
        var themes = localStorage.getItem("themes");
        return themes && JSON.parse(themes) || [];
    },

    setThemes(themes) {
        if (themes) {
            localStorage.setItem("themes", JSON.stringify(themes));
        }
        localStorage.setItem("update-time", Date.now().toString());
    }
};

module.exports = Themes;
