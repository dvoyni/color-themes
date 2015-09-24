var React = require("react");
var i18n = require("core/i18n");
var Application = require("core/Application");
var Header = require("components/Header/Header");
var StringUtils = require("utils/StringUtils");

require("./HelpView.less");

var HelpView = React.createClass({
    statics: {
        uri: "help",
        getTitle() {
            return StringUtils.format("{0} – {1}", i18n("Help"), i18n("IDE Color Themes"))
        }
    },

    getInitialState: function() {
        return {};
    },

    getDefaultProps: function() {
        return {};
    },

    componentDidMount: function() {
    },

    componentWillUnmount() {
    },

    render: function() {
        return (
            <div id="help-view">
                <Header />

                <div className="wrapper">
                    <div className="spacer"></div>
                    <div className="content">
                        <h1>{i18n("How to install a theme?")}</h1>

                        <p>
                            {i18n(
                                "Select «File» → «Import Setting» from the main menu " +
                                "and follow the instructions. After the IDE restarted " +
                                "go to the Preferences, expand «Editor» → «Colors and fonts» tab " +
                                "and choose the installed theme.")}
                        </p>

                        <h1>{i18n("Which IDEs are supported?")}</h1>

                        <p>
                            {i18n(
                                "Themes on this site support fully all family of JetBrains' IDEs: " +
                                "IntelliJ IDEA, PhpStorm, PyCharm, RubyMine, WebStorm and AppCode.")}
                        </p>

                        <h1>{i18n("Which platforms are supported?")}</h1>

                        <p>
                            {i18n("Windows, Mac OS and Linux are fully supported.")}
                        </p>

                        <h1>{i18n("How can I help to improve the site?")}</h1>

                        <p dangerouslySetInnerHTML={{ __html: i18n(
                            "This is an open source project. You can explore sources at " +
                            "<a href='{0}'>{0}</a>. " +
                            "Will be great if you provide translations, language colors or " +
                            "other improvements.", "https://github.com/y-a-r-g/color-themes")}}/>


                        <h1>{i18n("Which license are themes released under?")}</h1>

                        <p dangerouslySetInnerHTML={{__html: i18n("All themes are released under the {0} license.",
                            "<a href='http://creativecommons.org/licenses/by-sa/3.0/'>Create Commons Attribution-ShareAlike (BY-SA)</a>")}}>
                        </p>

                        <h1>{i18n("Did not find an answer to your question?")}</h1>

                        <p dangerouslySetInnerHTML={{ __html: i18n(
                            "Feel free to send email to " +
                            "{0} " +
                            "with any questions, suggestions, bug reports and others. " +
                            "I read and reply to every mail.",
                            StringUtils.format("<a href='mailto:{0}'>{0}</a>", Application.getConfigValue("admin-email")))}}/>
                    </div>
                    <div className="spacer"></div>
                </div>
            </div>);
    }
});

module.exports = HelpView;
