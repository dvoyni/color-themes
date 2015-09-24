var React = require("react");
var builders = require("builders/builders");
var i18n = require("core/i18n");

require("./DownloadBar.less");

var DownloadBar = React.createClass({
    getInitialState() {
        return {};
    },

    getDefaultProps() {
        return {
            theme: null
        };
    },

    componentDidMount() {
    },

    componentWillUnmount() {
    },

    onDownloadClick(event) {
        var builderName = event.target.getAttribute("data-builder");
        var builder = builders[builderName];
        if (builder && this.props.theme) {
            var built = builder.build(this.props.theme);

            var element = document.createElement('a');
            element.setAttribute('href', built.href);
            element.setAttribute('download', built.name);

            element.style.display = 'none';
            document.body.appendChild(element);

            element.click();

            document.body.removeChild(element);
        }
    },

    render() {
        return (
            <div className="download-bar">
                <div>{i18n("Download for")}</div>
                {Object.keys(builders).
                    map(name => (
                        <button key={name}
                                data-builder={name}
                                onClick={this.onDownloadClick}>
                            {i18n(name)}
                        </button>)
                )}
            </div>);
    }
});

module.exports = DownloadBar;
