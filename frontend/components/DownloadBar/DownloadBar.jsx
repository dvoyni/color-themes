import React, {Component, PropTypes} from "react";
import Builders from "../../builders/Builders";
import i18n from "../../core/i18n";
import * as Types from "../PropTypes";
import browser from "detect-browser";
import * as FileSaver from "browser-filesaver";
import Themes from "../../store/Themes";
import Application from "../../core/Application";

import "./DownloadBar.less";

export default class DownloadBar extends Component {
    static propTypes = {
        theme: Types.theme.isRequired
    }

    onDownloadClick(event) {
        try {
            if (browser.name === "chrome" || browser.name === "firefox") {
                var builderName = event.target.getAttribute("data-builder");
                var builder = Builders[builderName];
                builder.build_p(this.props.theme)
                    .then(built => {
                        FileSaver.saveAs(built.data, built.name);
                        Themes.increaseDowloadCounter(this.props.theme._id);
                    })
                .catch(err => Application.showError(err));

                event.stopPropagation();
                event.preventDefault();
            }
        }
        catch(err) {
        }
    }

    makeLink(builder) {
        var escapedBuilder = encodeURIComponent(builder);
        var themeId = this.props.theme._id;
        return (
            <a key={builder} data-builder={builder} onClick={e => this.onDownloadClick(e)}
               href={`/api/themes/${themeId}/compiled/${escapedBuilder}`}>
                {i18n(builder)}
            </a>);
    }

    render() {
        return (
            <div className="download-bar">
                <div>{i18n("Download for")}</div>
                {Object.keys(Builders).map(name => this.makeLink(name))}
            </div>);
    }
}
