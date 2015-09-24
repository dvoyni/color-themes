var Application = require("core/Application");
var Constraints = require("views/Constraints");
var Request = require("core/Request");

var IndexView = require("views/IndexView/IndexView");
var HelpView = require("views/HelpView/HelpView");
var ThemeView = require("views/ThemeView/ThemeView");
var UpdateView = require("views/UpdateView/UpdateView");

require("./main.less");

Application.init();

Application.setConfigValue("admin-email", "info@ideacolorthemes.org");

Request.setApiFn(apiFn);

Application.registerView(IndexView);
Application.registerView(HelpView);
Application.registerView(ThemeView);
Application.registerView(UpdateView);

Application.route();

function apiFn(method, request, params, callback, context) {
    Request.run("/api/" + request, method, {}, JSON.stringify(params), function(err, data) {
        callback.call(context, err, data && JSON.parse(data));
    });
}
