import React from "react";
import Component from "../../core/Component.jsx";
import i18n from "../../core/i18n";

import "./UploadView.less";

export default class UploadView extends Component {
    static uri = "upload";

    static get title() {
        return i18n("Ulpoad – IDE Color Themes");
    }

    render() {
        return (
            <div id="upload-view">
                <Header />
                    <div className="wrapper">
                    <h1>Log in</h1>
                </div>
            </div>);
    }
}
