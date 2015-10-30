import React, {Component, PropTypes} from "react";

import "./ProgressBar.less"

export default class ProgressBar extends Component {
    static propTypes = {
        value: PropTypes.number.isRequired,
        pending: PropTypes.bool
    }

    render() {
        var width = (this.props.pending ? 100 : this.props.value * 100) + "%";
        return (
            <div className="progress-bar">
                <div className={"progress-bar-inner" + (this.props.pending ? " pending" : "")}
                     style={{width: width}}></div>
                <div className="progress-bar-label">
                    {this.props.children}
                </div>
            </div>);
    }
}
