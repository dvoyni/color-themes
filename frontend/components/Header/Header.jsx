import React, {PropTypes, Component} from "react";
import i18n from "../../core/i18n";
import Link from "../Link/Link";
import LoginPanel from "../LoginPanel/LoginPanel";
import Application from "../../core/Application";

import IndexView from "../../views/IndexView/IndexView";
import HelpView from "../../views/HelpView/HelpView";
import DownloadAllView from "../../views/DownloadAllView/DownloadAllView";
import UploadView from "../../views/UploadView/UploadView";

import "./Header.less";

import logoImage from "./logo.svg";

export default class Header extends Component {
    static propTypes = {
        currentView: PropTypes.func.isRequired,
        user: PropTypes.shape({
            name: PropTypes.string.isRequired,
            email: PropTypes.string.isRequired,
            pending: PropTypes.bool.isRequired
        }).isRequired
    }

    render() {
        var menuItemClass = viewClass => "ignore-visited" +
        ((viewClass === this.props.currentView) ? " current" : "");

        return (
            <div>
                <div id="header">
                    <Link className="logo ignore-visited logo-image" view={IndexView}>
                        <img src={logoImage} />
                    </Link>
                    <Link className="logo ignore-visited" view={IndexView}>
                        {i18n(Application.getConfigValue("brand"))}
                    </Link>
                    <ul className="menu">
                        <li>
                            <Link view={DownloadAllView} className={menuItemClass(DownloadAllView)}>
                                {i18n("Download All Themes")}
                            </Link>
                        </li>
                        <li>
                            <Link view={UploadView} className={menuItemClass(UploadView)}>
                                {i18n("Upload Theme")}
                            </Link>
                        </li>
                        <li>
                            <Link view={HelpView} className={menuItemClass(IndexView)}>
                                {i18n("Help")}
                            </Link>
                        </li>
                        <li>
                            <a href="https://twitter.com/color_themes"
                               className="ignore-visited">
                                {i18n("Twitter")}
                            </a>
                        </li>
                    </ul>
                    <div className="spacer"></div>
                    <LoginPanel user={this.props.user}/>
                </div>
                <div id="disclaimer">
                    This site is in beta. Please post bugs/issues to
                the <a href="https://github.com/y-a-r-g/color-themes/issues">github</a> or send
                    to <a href="mailto:info@color-themes.com">info@color-themes.com</a>. Thank you!</div>
            </div>);
    }
}
