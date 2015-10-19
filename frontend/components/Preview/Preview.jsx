import React from "react";
import Component from "../../core/Component.jsx";

import "./Preview.less";

export default class Preview extends Component {
    static defaultProps = {
        styles: null,
        layout: null
    };

    render() {
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
}
