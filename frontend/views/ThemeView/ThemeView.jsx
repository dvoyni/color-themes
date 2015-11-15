import React, {Component, PropTypes} from "react";
import i18n from "../../core/i18n";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Request from "../../core/Request";
import Application from "../../core/Application";
import Layouts from "../../layouts/Layouts";
import Preview from "../../components/Preview/Preview";
import DownloadBar from "../../components/DownloadBar/DownloadBar";
import * as Types from "../../components/PropTypes";
import PendingIcon from "../../components/PendingIcon/PendingIcon";

import "./ThemeView.less";

export default class ThemeView extends Component {
    static uri = "theme";

    static get title() {
        return i18n(Application.getConfigValue("brand"));
    }

    static propTypes = {
        id: PropTypes.string.isRequired,
        theme: Types.theme
    }

    static extractAdditionalProps(state) {
        return {
            user: state.user
        };
    }

    render() {
        var theme = this.props.theme;
        if (theme) {
            var pageStyle = {},
                text = theme.styles.TEXT;

            if (text) {
                if (text.color) {
                    pageStyle.color = "#" + text.color;
                }
                if (text.backgroundColor) {
                    pageStyle.backgroundColor = "#" + text.backgroundColor;
                }
            }

            return (
                <div id="theme-view">
                    <Header user={this.props.user} currentView={ThemeView} />

                    <div className="wrapper" style={pageStyle}>
                        <div className="spacer"></div>
                        <div className="content">
                            <h1>{theme.title}</h1>
                            <p className="comment" style={{borderColor: pageStyle.color}}>
                                {theme.comment}
                            </p>

                            <p className="author" style={{borderColor: pageStyle.color}}>
                                {i18n("Author: ")} {theme.website ? (<a href={theme.website}>
                                    {theme.author || theme.website}
                                </a>) : theme.author }
                            </p>

                            <DownloadBar theme={this.props.theme} />

                            {Object.keys(Layouts).map(layoutName => (
                                    <div key={layoutName}>
                                        <h2>{i18n(layoutName)}</h2>
                                        <Preview styles={theme.styles}
                                                 layout={Layouts[layoutName]}/>
                                    </div>)
                            )}

                            <DownloadBar theme={this.props.theme} />
                        </div>
                        <div className="spacer"></div>
                    </div>

                    <Footer />
                </div>
            );
        }
        else {
            return (
                <div>
                    <Header user={this.props.user} currentView={ThemeView} />
                    <PendingIcon />
                </div>);
        }
    }
}
