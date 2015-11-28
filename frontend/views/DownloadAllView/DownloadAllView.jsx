import React, {Component, PropTypes} from "react";
import i18n from "../../core/i18n";
import User from "../../store/User";
import LoginPanel from "../../components/LoginPanel/LoginPanel";
import Header from "../../components/Header/Header";
import * as Types from "../../components/PropTypes";
import Application from "../../core/Application";
import DownloadAllBar from "../../components/DownloadBar/DownloadAllBar";

import "./DownloadAllView.less";

export default class DownloadAllView extends Component {
    static uri = "download-all";

    static propTypes = {
        user: Types.user.isRequired,
        payed: PropTypes.any
    }

    static get title() {
        var page = i18n("Download All"),
            title = i18n(Application.getConfigValue("brand"));

        return `${page} – ${title}`;
    }

    static extractAdditionalProps(state) {
        return {
            user: state.user
        };
    }

    componentDidMount() {
        User.update(true);
        this.updateInterval = setInterval(() => this.updateUser(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.updateInterval);
    }

    updateUser() {
        if (this.props.payed && this.props.user.email && !this.props.user.isPremium) {
            User.update(true);
        }
    }

    renderAuthRequired() {
        return (
            <div>
                <h2>{i18n("Authentication is Recommended")}</h2>
                <p>{i18n("We ask you to register to allow you download renewed archive of themes later without additional charges. " +
                    "New themes are added regulary. Also time to time we will expand list of supported IDEs. " +
                    "This is definitely worth to take a mine to register. ")}</p>
                <div className="login-panel-wrapper">
                    <LoginPanel user={this.props.user}/>
                </div>
                <p>{i18n("If you skip registration – new account will be created using your PayPal email.")}</p>
            </div>);
    }

    renderPaymentForm() {
        return (
            <div className="paypal-button-wrapper">
                <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                    <input type="hidden" name="cmd" value="_s-xclick"/>
                    <input type="hidden" name="hosted_button_id" value={Application.getConfigValue("paypalId")}/>
                    <input type="hidden" name="custom" value={this.props.user.email}/>
                    <input type="hidden" name="notify_url"
                           value={Application.getConfigValue("ipnUrl")}/>
                    <input type="image"
                           src="https://www.paypalobjects.com/en_US/RU/i/btn/btn_buynowCC_LG.gif"
                           border="0" name="submit"
                           alt="PayPal - The safer, easier way to pay online!"/>
                    <img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif"
                         width="1" height="1"/>
                </form>
            </div>);
    }

    renderDownloadOptions() {
        return (<div><DownloadAllBar /></div>);
    }

    renderPaymentInformation() {
        return (
            <div>
                {!this.props.user.email ? this.renderAuthRequired(): []}
                <h2>{i18n("Payment Information")}</h2>
                <p>{i18n("You can download all themes in a single archive for ${price}. It will help us to keep the site online. Thank you!",
                    {price: Application.getConfigValue("price")})}</p>
                {this.renderPaymentForm()}
            </div>);
    }

    renderBody() {
        if (!this.props.user.pending) {
            if (this.props.payed && !this.props.user.isPremium && this.props.user.email) {
                return (<div>Waiting for transaction being finished.</div>);
            }
            else {
                if (this.props.user.isPremium) {
                    return this.renderDownloadOptions();
                }
                else {
                    return this.renderPaymentInformation();
                }
            }
        }
    }

    render() {
        var email = Application.getConfigValue("email");
        var emailLink = `<a href='mailto:${email}'>${email}</a>`;

        return (
            <div id="download-all-view">
                <Header user={this.props.user} currentView={DownloadAllView}/>
                <div className="single-column-wrapper">
                    <div className="spacer"></div>
                    <div className="content">
                        <h1>{i18n("Download All Themes in a Single Archive")}</h1>
                        {this.renderBody()}
                        <div className="disclaimer" dangerouslySetInnerHTML={{ __html: i18n(
                            "If you experiencing any trouble with paying or downloading – feel free to write a message to ${email}. We will help you.",
                            {email: emailLink})}}></div>
                    </div>
                    <div className="spacer"></div>
                </div>
            </div>);
    }
}
