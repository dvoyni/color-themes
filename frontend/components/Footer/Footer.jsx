import React from "react";
import Component from "../../core/Component.jsx";
import i18n from "../../core/i18n";
import Application from "../../core/Application";

import "./Footer.less";

export default class Footer extends Component {
    render() {
        var email = Application.getConfigValue("admin-email");
        var emailLink = `<a href='mailto:${email}'>${email}</a>`;
        var licenseLink = "<a href='http://creativecommons.org/licenses/by-sa/3.0/'>Create Commons Attribution-ShareAlike (BY-SA)</a>";
        return (
            <div id="footer">
                <div dangerouslySetInnerHTML={{
                        __html: i18n("All themes are released under the ${licenseLink} license.", {licenseLink: licenseLink})
                    }}></div>
                <div dangerouslySetInnerHTML={{
                        __html: i18n("Feedback email: ${emailLink}.", {emailLink:emailLink})
                    }}></div>
            </div>);
    }
}
