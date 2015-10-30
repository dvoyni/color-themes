import React, {Component, PropTypes} from "react";
import Builders from "../../builders/Builders";
import i18n from "../../core/i18n";
import * as Types from "../PropTypes";

import "./DownloadBar.less";

export default class DownloadBar extends Component {
    static propTypes = {
        onClick: PropTypes.func.isRequired
    }

    onDownloadClick(event) {
        var builderName = event.target.getAttribute("data-builder");
        this.props.onClick(builderName);
    }

    render() {
        return (
            <div className="download-bar">
                <div>{i18n("Download for")}</div>
                {Object.keys(Builders).
                    map(name => (
                        <button key={name}
                                data-builder={name}
                                onClick={e => this.onDownloadClick(e)}>
                            {i18n(name)}
                        </button>)
                )}
            </div>);
    }
}
