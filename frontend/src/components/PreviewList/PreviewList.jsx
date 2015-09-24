var React = require("react");
var PreviewListItem = require("components/PreviewListItem/PreviewListItem");

require("./PreviewList.less");

var PreviewList = React.createClass({
    getInitialState: function() {
        return {};
    },

    getDefaultProps: function() {
        return {
            layout: null,
            themes: []
        };
    },

    render: function() {
        return (
            <div className="preview-list" ref="list">
                {this.props.themes.map(theme =>
                    <PreviewListItem theme={theme} layout={this.props.layout} key={theme._id}/>)}
            </div>);
    }
});

module.exports = PreviewList;
