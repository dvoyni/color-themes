import React from "react";
import Component from "../../core/Component.jsx";
import builders from "../../builders/builders";
import i18n from "../../core/i18n";
import Themes from "../../store/Themes";

import "./DownloadBar.less";

export default class DownloadBar extends Component {
    static defaultProps = {
        theme: null
    };

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

            Themes.increaseDowloadCounter(this.props.theme._id);
        }
    }

    render() {
        return (
            <div className="download-bar">
                <div>{i18n("Download for")}</div>
                {Object.keys(builders).
                    map(name => (
                        <button key={name}
                                data-builder={name}
                                onClick={::this.onDownloadClick}>
                            {i18n(name)}
                        </button>)
                )}
            </div>);
    }
}
