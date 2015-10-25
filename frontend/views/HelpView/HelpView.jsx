import React, {Component} from "react";
import i18n from "../../core/i18n";
import Application from "../../core/Application";
import Header from "../../components/Header/Header";
import StringUtils from "../../utils/StringUtils";

import "./HelpView.less";

export default class HelpView extends Component {
    static uri = "help";

    static get title() {
        return StringUtils.format("${help} – ${title}", {
            help: i18n("Help"),
            title: i18n("IDE Color Themes")
        });
    }

    static extractAdditionalProps(state) {
        return {
            user: state.user
        };
    }

    render() {
        var email = StringUtils.format("<a href='mailto:${email}'>${email}</a>", {
            email:Application.getConfigValue("admin-email")
        });
        return (
            <div id="help-view">
                <Header user={this.props.user} currentView={HelpView} />

                <div className="wrapper">
                    <div className="spacer"></div>
                    <div className="content">
                        <h1>{i18n("How to install a theme?")}</h1>

                        <p>
                            {i18n(
                                "Select «File» → «Import Setting» from the main menu " +
                                    "and follow the instructions. After the IDE restarted " +
                                    "go to the Preferences, expand «Editor» → «Colors and fonts» tab " +
                                    "and choose the installed theme.")}
                        </p>

                        <h1>{i18n("Which IDEs are supported?")}</h1>

                        <p>
                            {i18n(
                                "Themes on this site support fully all family of JetBrains' IDEs: " +
                                    "IntelliJ IDEA, PhpStorm, PyCharm, RubyMine, WebStorm and AppCode.")}
                        </p>

                        <h1>{i18n("Which platforms are supported?")}</h1>

                        <p>
                            {i18n("Windows, Mac OS and Linux are fully supported.")}
                        </p>

                        <h1>{i18n("How can I help to improve the site?")}</h1>

                        <p dangerouslySetInnerHTML={{ __html: i18n(
                            "This is an open source project. You can explore sources at " +
                            "<a href='${url}'>${url}</a>. " +
                            "Will be great if you provide translations, language colors or " +
                            "other improvements.", {url: "https://github.com/y-a-r-g/color-themes"})}}/>


                        <h1>{i18n("Which license are themes released under?")}</h1>

                        <p dangerouslySetInnerHTML={{__html: i18n("All themes are released under the ${license} license.", {
                            license: "<a href='http://creativecommons.org/licenses/by-sa/3.0/'>Create Commons Attribution-ShareAlike (BY-SA)</a>"})}}>
                        </p>

                        <h1>{i18n("Did not find an answer to your question?")}</h1>

                        <p dangerouslySetInnerHTML={{ __html: i18n(
                            "Feel free to send email to " +
                            "${email} " +
                            "with any questions, suggestions, bug reports and others. " +
                            "I read and reply to every mail.",{email: email})}}/>
                    </div>
                    <div className="spacer"></div>
                </div>
            </div>);
    }
}
