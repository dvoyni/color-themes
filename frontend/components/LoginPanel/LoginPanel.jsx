import React, {Component, PropTypes} from "react";
import i18n from "../../core/i18n";
import User from "../../store/User";
import Application from "../../core/Application";
import LoginForm, {LoginFormType} from "./LoginForm";
import UserMenu from "./UserMenu";
import * as Types from "../PropTypes";

import "./LoginPanel.less";

export default class LoginPanel extends Component {
    static propTypes = {
        user: Types.user.isRequired
    }

    state = {
        menu: false,
        loginForm: false,
        registerForm: false,
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
    }

    onShowMenuClick(event) {
        event.preventDefault();
        this.showForm("menu");
    }

    onShowLoginFormClick(event) {
        event.preventDefault();
        event.stopPropagation();
        this.showForm("loginForm");
    }

    onShowRegisterFormClick(event) {
        event.preventDefault();
        event.stopPropagation();
        this.showForm("registerForm");
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

    showForm(name) {
        var state = {menu: false, loginForm: false, registerForm: false};
        if (!this.state[name]) {
            state[name] = true;
        }
        this.setState(state);
    }

    render() {
        if (this.props.user.pending) {
            return <div className="login-panel"></div>;
        }
        else if (this.props.user.email) {
            return (
                <div className={"login-panel"}>
                    <button onClick={this.onShowMenuClick}
                       className="button-link">
                        {this.props.user.name || this.props.user.email}
                    </button>
                    {this.state.menu ? <UserMenu onLogout={this.onLogout}/> : ""}
                </div>);
        }
        else {
            return (
                <div className="login-panel">
                    <button onClick={this.onShowLoginFormClick}
                       className="button-link">
                        {i18n("Sign in")}
                    </button>
                    {i18n(" or ")}
                    <button onClick={this.onShowRegisterFormClick}
                       className="button-link">
                        {i18n("register")}
                    </button>
                    {(this.state.loginForm || this.state.registerForm) ?
                        (<LoginForm
                            type={this.state.loginForm ? LoginFormType.TYPE_LOGIN : LoginFormType.TYPE_REGISTER}
                            onSubmit={this.onSubmit}
                            onFieldChange={this.onFieldChange}
                            name={this.state.name}
                            email={this.state.email}
                            password={this.state.password}/>)
                        : ""}
                </div>);
        }
    }
}
