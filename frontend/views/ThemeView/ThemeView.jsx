import React from "react";
import Component from "../../core/Component.jsx";
import StringUtils from "../../utils/StringUtils";
import i18n from "../../core/i18n";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Request from "../../core/Request";
import Application from "../../core/Application";
import layouts from "../../layouts/layouts";
import Preview from "../../components/Preview/Preview";
import DownloadBar from "../../components/DownloadBar/DownloadBar";
import Themes from "../../store/Themes";

import "./ThemeView.less";

export default class ThemeView extends Component {
    static uri = "theme";

    static get title() {
        return i18n("IDE Color Themes");
    }

    static defaultProps ={
        id: null,
        __updated: false
    };

    state = {
        theme: null
    };

    componentDidMount() {
        Themes.getTheme(this.props.id, ::this.onThemeReceived);
    }

    onThemeReceived(theme) {
        this.setState({theme: theme});
    }

    render() {
        var theme = this.state.theme;
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
                <div id="theme-view" style={pageStyle}>
                    <Header />

                    <div className="wrapper">
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

                            <DownloadBar theme={theme} />

                            {Object.keys(layouts).map(layoutName => (
                                    <div key={layoutName}>
                                        <h2>{i18n(layoutName)}</h2>
                                        <Preview styles={theme.styles}
                                                 layout={layouts[layoutName]}/>
                                    </div>)
                            )}

                            <DownloadBar className="bottom" theme={theme} />
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
                    <Header />
                </div>);
        }
    }
}
