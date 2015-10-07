var React = require("react");
var i18n = require("core/i18n");
var Application = require("core/Application");
var Link = require("components/Link/Link");
var LoginPanel = require("components/LoginPanel/LoginPanel");

require("./Header.less");

var Header = React.createClass({
    getInitialState() {
        return {};
    },

    getDefaultProps() {
        return {
        };
    },

    render() {
        var url = Application.makeViewUrl;
        var menuItemClass = viewClass => "ignore-visited" +
            ((viewClass.uri === Application.getCurrentView().constructor.uri) ? "current" : "");

        var IndexView = require("views/IndexView/IndexView");
        var HelpView = require("views/HelpView/HelpView");

        return (
            <div id="header">
                <Link className="logo ignore-visited" view={IndexView}>{i18n("IDE Color Themes")}</Link>
                <ul className="menu">
                    <li><Link view={HelpView}
                       className={menuItemClass(IndexView)}>{i18n("Help")}</Link></li>
                    <li><a href="https://twitter.com/IdeaColorThemes"
                       className={menuItemClass(IndexView)}>{i18n("Twitter")}</a></li>
                </ul>
                <div class="spacer"></div>
                <LoginPanel />
            </div>);
    }
});

module.exports = Header;
