import React, {Component, PropTypes} from "react";
import i18n from "../../core/i18n";
import Application from "../../core/Application";
import Header from "../../components/Header/Header";
import Themes from "../../store/Themes";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import Builders from "../../builders/Builders";
import DOMUtils from "../../utils/DOMUtils";
import * as Types from "../../components/PropTypes";

import "./BuildArchiveView.less";
import BuildWorker from "webworker!./BuildWorker";

export default class BuildArchiveView extends Component {
    static uri = "build-archive";

    static get title() {
        var page = i18n("Building archive"),
            title = i18n(Application.getConfigValue("brand"));

        return `${page} – ${title}`;
    }

    static extractAdditionalProps(state) {
        return {
            user: state.user
        };
    }

    static propTypes = {
        builder: PropTypes.string.isRequired,
        user: Types.user.isRequired
    }

    state = {
        downloadingThemes: 0,
        buildingArchive: 0
    }

    componentDidMount() {
        Themes.downloadAll(t => this.onThemesDownloaded(t), p => this.onThemesDownloadProgress(p));
    }

    onThemesDownloaded(temes) {
        this.setState({downloadingThemes: 1});
        var worker = new BuildWorker();
        worker.addEventListener("message", e => this.onBuildWorkerEvent(e));
        worker.postMessage({
            themes: temes,
            builder: this.props.builder
        });
    }

    onThemesDownloadProgress(progress) {
        this.setState({downloadingThemes: progress});
    }

    onBuildWorkerEvent(e) {
        switch (e.data.type) {
            case "progress":
                this.setState({buildingArchive: e.data.value});
                break;

            case "done":
                this.setState({buildingArchive: 1});
                DOMUtils.triggerDownload("all-color-themes.zip", e.data.archive);
                break;
        }
    }

    render() {
        return (
            <div id="build-archive-view">
                <Header user={this.props.user} currentView={BuildArchiveView}/>

                <div className="single-column-wrapper">
                    <div className="spacer"></div>
                    <div className="content">
                        <h1>{i18n("Download All Themes in a Single Archive")}</h1>
                        <ProgressBar value={this.state.downloadingThemes}
                                     pending={this.state.downloadingThemes === 0}>
                            {i18n("Downloading themes")}
                        </ProgressBar>
                        <ProgressBar value={this.state.buildingArchive}>
                            {i18n("Building archive")}
                        </ProgressBar>
                    </div>
                    <div className="spacer"></div>
                </div>
            </div>);
    }
}
