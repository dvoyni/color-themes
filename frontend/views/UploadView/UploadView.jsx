import React, {Component} from "react";
import i18n from "../../core/i18n";
import User from "../../store/User.jsx";
import LoginPanel from "../../components/LoginPanel/LoginPanel.jsx";

import "./UploadView.less";

export default class UploadView extends Component {
    static uri = "upload";

    static get title() {
        return i18n("Ulpoad – IDE Color Themes");
    }

    state = {
        loggedIn: false
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        //User.dispatcher.on("logIn", ::this.onLogIn);
    }

    componentWillUnmount() {
        //User.dispatcher.off("logIn", ::this.onLogIn);
    }

    onLogIn() {
        this.setState({loggedIn: true});
    }

    renderAuthRequired() {
        return (
            <div className="wrapper">
                <h1>{i18n("Authentication required")}</h1>
                <p>{i18n("You have to be registered and logged in user to upload a theme.")}</p>
                <LoginPanel />
            </div>);
    }

    renderUpload() {
        return (
            <div className="wrapper">
                <h1>{i18n("Upload a Theme")}</h1>
            </div>);
    }

    render() {
        return (
            <div id="upload-view">
                <Header />
                <div className="wrapper">
                    {this.state.loggedIn ? this.renderUpload() : this.renderAuthRequired()}
                </div>
            </div>);
    }
}
