import React, {Component, PropTypes} from "react";
import i18n from "../../core/i18n";
import User from "../../store/User";
import Application from "../../core/Application";
import LoginForm, {LoginFormType} from "./LoginForm";
import UserMenu from "./UserMenu";
import * as Types from "../PropTypes";

import "./LoginPanel.less";

import userIcon from "./user-icon.svg";

export default class LoginPanel extends Component {
    static propTypes = {
        user: Types.user.isRequired
    }

    state = {
        formType: null,
        name: "",
        email: "",
        password: ""
    }

    constructor(props) {
        super(props);

        this.onShowMenuClick = this.onShowMenuClick.bind(this);
        this.onShowLoginFormClick = this.onShowLoginFormClick.bind(this);
        this.onShowRegisterFormClick = this.onShowRegisterFormClick.bind(this);
        this.onLogout = this.onLogout.bind(this);
        this.onFieldChange = this.onFieldChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onRestorePassword = this.onRestorePassword.bind(this);
    }

    onShowMenuClick(event) {
        event.preventDefault();
        event.stopPropagation();
        this.showForm("menu");
        event.target.blur();
    }

    onShowLoginFormClick(event) {
        event.preventDefault();
        event.stopPropagation();
        this.showForm(LoginFormType.TYPE_LOGIN);
        event.target.blur();
    }

    onShowRegisterFormClick(event) {
        event.preventDefault();
        event.stopPropagation();
        this.showForm(LoginFormType.TYPE_REGISTER);
        event.target.blur();
    }

    onLogout() {
        this.setState({pending: true});
        this.showForm();
        User.logout();
    }

    onFieldChange(fields) {
        this.setState(fields);
    }

    onSubmit() {
        switch (this.state.formType) {
            case LoginFormType.TYPE_LOGIN:
                User.login(this.state.email, this.state.password);
                break;

            case LoginFormType.TYPE_REGISTER:
                User.register(this.state.email, this.state.password, this.state.name);
                break;

            case LoginFormType.TYPE_RESTORE:
                this.setState({formType: LoginFormType.TYPE_LOGIN});
                User.restore(this.state.email);
                break;
        }
    }

    onRestorePassword(event) {
        this.showForm(LoginFormType.TYPE_RESTORE);
        event.target.blur();
    }

    requestInfo() {
        this.setState({pending: true});

        User.getInfo((err, userInfo) => {
            this.setState({
                signedIn: !!userInfo.email,
                name: userInfo.name,
                email: userInfo.email,
                pending: false
            });
        });
    }

    showForm(formType) {
        if (formType === this.state.formType) {
            formType = null;
        }
        this.setState({formType});
    }

    renderContent() {
        if (this.props.user.email) {
            return (
                <span className="login-panel">
                    <button onClick={this.onShowMenuClick}
                            className="button-link id-username">
                        {this.props.user.name || this.props.user.email}
                    </button>
                    {this.state.formType === LoginFormType.TYPE_MENU ? <UserMenu onLogout={this.onLogout}/> : ""}
                </span>);
        }
        else if (!this.props.user.pending) {
            return (
                <span>
                    <button onClick={this.onShowLoginFormClick}
                            className="button-link id-login">
                        {i18n("Sign in")}
                    </button>
                    {i18n(" or ")}
                    <button onClick={this.onShowRegisterFormClick}
                            className="button-link id-register">
                        {i18n("register")}
                    </button>
                    {this.state.formType ?
                        (<LoginForm
                            type={this.state.formType}
                            onSubmit={this.onSubmit}
                            onFieldChange={this.onFieldChange}
                            onRestorePassword={this.onRestorePassword}
                            name={this.state.name}
                            email={this.state.email}
                            password={this.state.password}/>)
                        : ""}
                </span>);
        }
    }

    render() {
        return (<div className="login-panel">
            <img src={userIcon}/>
            {this.renderContent()}
        </div>);
    }
}
