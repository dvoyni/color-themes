import React, {Component, PropTypes} from "react";
import Builders from "../../builders/Builders";
import i18n from "../../core/i18n";
import * as Types from "../PropTypes";
import browser from "detect-browser";
import * as FileSaver from "browser-filesaver";
import Themes from "../../store/Themes";
import store from "../../store/store";
import CurrentViewActions from "../../store/state/currentView";
import BuildArchiveView from "../../views/BuildArchiveView/BuildArchiveView";

import "./DownloadBar.less";

export default class DownloadAllBar extends Component {
    onDownloadClick(event) {
        try {
            if (browser.name === "chrome" || browser.name === "firefox") {
                event.stopPropagation();
                event.preventDefault();

                var builderName = event.target.getAttribute("data-builder");
                store.dispatch(CurrentViewActions.showView(BuildArchiveView.uri,
                    {builder: builderName}));
            }
        }
        catch (err) {
        }
    }

    makeLink(builder) {
        var escapedBuilder = encodeURIComponent(builder);
        return (
            <a key={builder} data-builder={builder} onClick={e => this.onDownloadClick(e)}
               href={`/api/themes/compiled/${escapedBuilder}`}>
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
