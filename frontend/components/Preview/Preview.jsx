import React, {Component, PropTypes} from "react";

import "./Preview.less";

export default class Preview extends Component {
    static propTypes = {
        styles: PropTypes.object.isRequired,
        layout: PropTypes.object.isRequired
    };

    render() {
        var layout = this.props.layout;
        var styles = this.props.styles;
        var fallback = layout.fallback || {};
        var html = "";
        if (styles && layout) {
            html = layout.text.replace(layout.tagStart, function(match, value) {
                var values = [value].concat(fallback[value] || []);
                for (var i = 0; i < values.length; i++) {
                    var style = styles[values[i]];
                    if (style) {
                        return "<span style=\"" + style.css + "\">";
                    }
                }
                return "<span>";
            }).replace(layout.tagEnd, "</span>");
        }

        return (<div dangerouslySetInnerHTML={{__html: html}} className="preview"></div>);
    }
}
