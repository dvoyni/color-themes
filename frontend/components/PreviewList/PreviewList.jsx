import React, {Component, PropTypes} from "react";
import PreviewListItem from "../../components/PreviewListItem/PreviewListItem";

require("./PreviewList.less");

export default class PreviewList extends Component {
    static propTypes = {
        layout: React.PropTypes.object.isRequired,
        themes: PropTypes.arrayOf(React.PropTypes.any).isRequired
    }

    render() {
        return (
            <div className="preview-list" ref="list">
                {this.props.themes.map(theme =>
                    <PreviewListItem theme={theme} layout={this.props.layout} key={theme._id}/>)}
            </div>);
    }
}
