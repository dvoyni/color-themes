var React = require("react");
var i18n = require("core/i18n");
var Header = require("components/Header/Header");
var Request = require("core/Request");
var Application = require("core/Application");
var Themes = require("store/Themes");

require("./UpdateView.less");

var UpdateView = React.createClass({
    statics: {
        uri: "update",
        getTitle() {
            return i18n("IDE Color Themes");
        }
    },

    getInitialState() {
        return {};
    },

    getDefaultProps() {
        return {
            nextView: {view: "index", __updated: true}
        };
    },

    componentDidMount() {
        var nextView = this.props.nextView;

        Request.api("GET", "themes", {},
            (err, themes) => {
                if (err) {
                    Application.showError(err);
                }
                else {
                    Themes.setThemes(themes);
                }

                Application.route(nextView, true);
            });
    },

    componentWillUnmount() {
    },

    render() {
        return (
            <div id="update-view">
                <Header />
                <div className="wrapper">
                    <div className="spinner">
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    <h1>{i18n("Checking for new themes")}</h1>
                </div>
            </div>);
    }
});

module.exports = UpdateView;
