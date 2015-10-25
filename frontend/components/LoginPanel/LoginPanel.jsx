import React, {Component, PropTypes} from "react";
import i18n from "../../core/i18n";
import User from "../../store/User";
import Application from "../../core/Application";
import LoginForm, {LoginFormType} from "./LoginForm";
import UserMenu from "./UserMenu";

import "./LoginPanel.less";

export default class LoginPanel extends Component {
    static propTypes = {
        user: PropTypes.shape({
            name: PropTypes.string.isRequired,
            email: PropTypes.string.isRequired,
            pending: PropTypes.bool.isRequired
        }).isRequired
    }

    state = {
        menu: false,
        loginForm: false,
        registerForm: false,
        name: "",
        email: "",
        password: ""
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

    onLogIn() {
        this.requestInfo();
    }

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
        User.logout();
    }

    onFieldChange(fields) {
        this.setState(fields);
    }

    onSubmit() {
        if (this.state.loginForm) {
            User.login(this.state.email, this.state.password);
        }
        else {
            User.register(this.state.email, this.state.password, this.state.name);
        }
    }

    render() {
        if (this.props.user.pending) {
            return <div className="login-panel"></div>;
        }
        else if (this.props.user.email) {
            return (
                <div className={"login-panel"}>
                    <a href="#" onClick={e => this.onShowMenuClick(e)}
                       className="no-redirect ignore-visited">
                        {this.props.user.name || this.props.user.email}
                    </a>
                    {this.state.menu ? <UserMenu onLogout={e => this.onLogout(e)}/> : ""}
                </div>);
        }
        else {
            return (
                <div className="login-panel">
                    <a href="#" onClick={e => this.onShowLoginFormClick(e)}
                       className="no-redirect ignore-visited">
                        {i18n("Sign in")}
                    </a>
                    {i18n(" or ")}
                    <a href="#" onClick={e => this.onShowRegisterFormClick(e)}
                       className="no-redirect ignore-visited">
                        {i18n("register")}
                    </a>
                    {(this.state.loginForm || this.state.registerForm) ?
                        (<LoginForm
                            type={this.state.loginForm ? LoginFormType.TYPE_LOGIN : LoginFormType.TYPE_REGISTER}
                            onSubmit={() => this.onSubmit()}
                            onFieldChange={f => this.onFieldChange(f)}
                            name={this.state.name}
                            email={this.state.email}
                            password={this.state.password}/>)
                        : ""}
                </div>);
        }
    }
}
