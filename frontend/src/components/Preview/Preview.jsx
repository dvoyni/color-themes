var React = require("react");

require("./Preview.less");

var Preview = React.createClass({
    getDefaultProps: function() {
        return {
            styles: null,
            layout: null
        };
    },

    render: function() {
        var layout = this.props.layout;
        var styles = this.props.styles;
        var html = "";
        if (styles && layout) {
            html = layout.text.replace(layout.tagStart, function(match, value) {
                var style = styles[value];
                if (style) {
                    return "<span style=\"" + style.css + "\">";
                }
                return "<span>";
            }).replace(layout.tagEnd, "</span>");
        }

        return (<div dangerouslySetInnerHTML={{__html: html}} className="preview"></div>);
    }
});

module.exports = Preview;
