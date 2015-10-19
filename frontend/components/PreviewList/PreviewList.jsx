import React from "react";
import Component from "../../core/Component.jsx";
import PreviewListItem from "../../components/PreviewListItem/PreviewListItem";

require("./PreviewList.less");

export default class PreviewList extends Component {
    static defaultProps ={
        layout: null,
        themes: []
    };

    render() {
        return (
            <div className="preview-list" ref="list">
                {this.props.themes.map(theme =>
                    <PreviewListItem theme={theme} layout={this.props.layout} key={theme._id}/>)}
            </div>);
    }
}
