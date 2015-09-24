var React = require("react");
var Preview = require("components/Preview/Preview");
var Application = require("core/Application");
var ThemeView = require("views/ThemeView/ThemeView");
var Link = require("components/Link/Link");

require("./PreviewListItem.less");

var downloadIcon = require("./download-icon.png");

var PreviewListItem = React.createClass({
    getDefaultProps: function() {
        return {
            theme: null,
            layout: null
        };
    },

    render: function() {
        return (
            <Link view={ThemeView} params={{id: this.props.theme._id}} className="preview-list-item no-decoration">
                <Preview styles={this.props.theme.styles} layout={this.props.layout} className="preview"/>
                <div className="info">
                    <div className="title">{this.props.theme.title}</div>
                    <img src={downloadIcon} />
                    <div className="downloads">{this.props.theme.downloads}</div>
                </div>
            </Link>);
    }
});

module.exports = PreviewListItem;
