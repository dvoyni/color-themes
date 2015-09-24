var React = require("react");
var i18n = require("core/i18n");
var StringUtils = require("utils/StringUtils");
var Application = require("core/Application");

require("./Footer.less");

var Footer = React.createClass({
    getInitialState: function() {
        return {};
    },

    render: function() {
        var emailLink = StringUtils.format("<a href='mailto:{0}'>{0}</a>", Application.getConfigValue("admin-email"));
        var licenseLink = "<a href='http://creativecommons.org/licenses/by-sa/3.0/'>Create Commons Attribution-ShareAlike (BY-SA)</a>";
        return (
            <div id="footer">
                <div
                    dangerouslySetInnerHTML={{__html: i18n("All themes are released under the {0} license.", licenseLink)}}></div>
                <div
                    dangerouslySetInnerHTML={{__html: i18n("Feedback email: {0}.", emailLink)}}></div>
            </div>);
    }
});

module.exports = Footer;
