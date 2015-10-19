import React from "react";
import Component from "../../core/Component.jsx";
import i18n from "../../core/i18n";
import User from "../../store/User";
import Application from "../../core/Application";
import LoginForm from "./LoginForm";
import UserMenu from "./UserMenu";

import "./LoginPanel.less";

export default class LoginPanel extends Component {
    componentDidMount() {
        User.getInfo((err, userInfo) => {
            this.setState({
                signedIn: !!userInfo.email,
                name: userInfo.name,
                email: userInfo.email,
                pending: false
            });
        });
    }

    state = {
        signedIn: false,
        pending: true,
        menu: false,
        loginForm: false,
        registerForm: false,
        name: "",
        email: "",
        password: ""
    };

    onShowMenuClick(event) {
        event.preventDefault();
        this.showForm("menu");
    }

    onShowLoginFormClick(event) {
        event.preventDefault();
        this.showForm("loginForm");
    }

    onShowRegisterFormClick(event) {
        event.preventDefault();
        this.showForm("registerForm");
    }

    showForm(name) {
        var state = {menu: false, loginForm: false, registerForm: false};
        if (!this.state[name]) {
            state[name] = true;
        }
        this.setState(state);
    }

    onLogout() {
        this.setState({pending: true});
        User.logout(() => {
            this.setState({
                signedIn: false,
                pending: false
            });
        });
    }

    onFieldChange(fields) {
        this.setState(fields);
    }

    onSubmit() {
        this.showForm();
        this.setState({pending: true});
        if (this.state.loginForm) {
            User.login(
                this.state.email,
                this.state.password,
                ::this.onLoggedIn);
        }
        else {
            User.register(
                this.state.email,
                this.state.password,
                this.state.name,
                ::this.onLoggedIn);
        }
    }

    onLoggedIn(err, userInfo) {
        if (err) {
            this.setState({pending: false});
            return Application.showError(err);
        }
        this.setState({
            pending: false,
            signedIn: !!userInfo.email,
            name: userInfo.name
        });
    }

    render() {
        if (this.state.pending) {
            return <div className="login-panel"></div>;
        }
        else if (this.state.signedIn) {
            return (
                <div className={"login-panel"}>
                    <a href="#" onClick={::this.onShowMenuClick} className="no-redirect ignore-visited">
                        {this.state.name || this.state.email}
                    </a>
                    {!this.state.menu ? [] :
                        <UserMenu onLogout={::this.onLogout} />
                    }
                </div>);
        }
        else {
            return (
                <div className="login-panel">
                    <a href="#" onClick={::this.onShowLoginFormClick} className="no-redirect ignore-visited">
                        {i18n("Sign in")}
                    </a>
                    {i18n(" or ")}
                    <a href="#" onClick={::this.onShowRegisterFormClick}
                       className="no-redirect ignore-visited">
                        {i18n("register")}
                    </a>
                    {(!this.state.loginForm && !this.state.registerForm) ? [] :
                        <LoginForm
                            type={this.state.loginForm ? LoginForm.TYPE_LOGIN : LoginForm.TYPE_REGISTER}
                            onSubmit={::this.onSubmit} onFieldChange={::this.onFieldChange}
                            name={this.state.name}
                            email={this.state.email}
                            password={this.state.password} />}
                </div>);
        }
    }
}
