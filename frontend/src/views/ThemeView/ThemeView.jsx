var React = require("react");
var StringUtils = require("utils/StringUtils");
var i18n = require("core/i18n");
var Header = require("components/Header/Header");
var Footer = require("components/Footer/Footer");
var Request = require("core/Request");
var Application = require("core/Application");
var layouts = require("layouts/layouts");
var Preview = require("components/Preview/Preview");
var DownloadBar = require("components/DownloadBar/DownloadBar");
var Themes = require("store/Themes");

require("./ThemeView.less");

var ThemeView = React.createClass({
    statics: {
        uri: "theme",
        getTitle() {
            return i18n("IDE Color Themes");
        }
    },

    getInitialState: function() {
        return {};
    },

    getDefaultProps: function() {
        return {
            id: null,
            __updated: false
        };
    },

    componentDidMount: function() {
        var UpdateView = require("views/UpdateView/UpdateView");

        if (!this.props.__updated && Themes.isUpdateRequired()) {
            Application.route({
                view: UpdateView.uri,
                nextView: {view: ThemeView.uri, id: this.props.id, __updated: true}
            });
        }
    },

    componentWillUnmount() {
    },

    render: function() {
        var theme = Themes.getThemes().
            filter(theme => theme._id === this.props.id)[0];

        if (theme) {
            var pageStyle = {},
                text = theme.styles.TEXT;

            if (text) {
                if (text.color) {
                    pageStyle.color = "#" + text.color;
                }
                if (text.backgroundColor) {
                    pageStyle.backgroundColor = "#" + text.backgroundColor;
                }
            }

            return (
                <div id="theme-view" style={pageStyle}>
                    <Header />

                    <div className="wrapper">
                        <div className="spacer"></div>
                        <div className="content">
                            <h1>{theme.title}</h1>
                            <p className="comment" style={{borderColor: pageStyle.color}}>
                                {theme.comment}
                            </p>

                            <p className="author" style={{borderColor: pageStyle.color}}>
                                {i18n("Author: ")} {theme.website ? (<a href={theme.website}>
                                    {theme.author || theme.website}
                                </a>) : theme.author }
                            </p>

                            <DownloadBar theme={theme} />

                            {Object.keys(layouts).map(layoutName => (
                                    <div key={layoutName}>
                                        <h2>{i18n(layoutName)}</h2>
                                        <Preview styles={theme.styles}
                                                 layout={layouts[layoutName]}/>
                                    </div>)
                            )}

                            <DownloadBar className="bottom" theme={theme} />
                        </div>
                        <div className="spacer"></div>
                    </div>

                    <Footer />
                </div>
            );
        }
        else {
            return (
                <div>
                    <Header />
                </div>);
        }
    }
});

module.exports = ThemeView;
