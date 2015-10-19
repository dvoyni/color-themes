import React from "react";
import Component from "../../core/Component.jsx";
import i18n from "../../core/i18n";
import Application from "../../core/Application";
import Link from "../Link/Link";
import LoginPanel from "../LoginPanel/LoginPanel";

import IndexView from "views/IndexView/IndexView";
import HelpView from "views/HelpView/HelpView";

import "./Header.less";

export default class Header extends Component {
    render() {
        var url = Application.makeViewUrl;
        var menuItemClass = viewClass => "ignore-visited" +
            ((viewClass.uri === Application.getCurrentView().constructor.uri) ? "current" : "");

        return (
            <div id="header">
                <Link className="logo ignore-visited" view={IndexView}>{i18n("IDE Color Themes")}</Link>
                <ul className="menu">
                    <li><Link view={HelpView}
                       className={menuItemClass(IndexView)}>{i18n("Help")}</Link></li>
                    <li><a href="https://twitter.com/IdeaColorThemes"
                       className={menuItemClass(IndexView)}>{i18n("Twitter")}</a></li>
                </ul>
                <div className="spacer"></div>
                <LoginPanel />
            </div>);
    }
}
