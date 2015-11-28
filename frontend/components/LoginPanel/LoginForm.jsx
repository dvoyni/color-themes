import React, {Component, PropTypes} from "react";
import i18n from "../../core/i18n";

export var LoginFormType = {
    TYPE_LOGIN: "login",
    TYPE_REGISTER: "register",
    TYPE_RESTORE: "restore",
    TYPE_MENU: "menu"
}

export default class LoginForm extends Component {
    static propTypes = {
        type: PropTypes.oneOf([LoginFormType.TYPE_LOGIN, LoginFormType.TYPE_REGISTER, LoginFormType.TYPE_RESTORE]),
        onSubmit: PropTypes.func.isRequired,
        onFieldChange: PropTypes.func.isRequired,
        onRestorePassword: PropTypes.func.isRequired,
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        password: PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);

        this.onFieldChange = this.onFieldChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onRestorePasswordClick = this.onRestorePasswordClick.bind(this);
    }

    onFieldChange(event) {
        event.stopPropagation();
        var fields = {};
        if (this.refs.loginEmail) {
            fields.email = this.refs.loginEmail.value;
        }
        if (this.refs.loginPassword) {
            fields.password = this.refs.loginPassword.value
        }
        if (this.refs.loginName) {
            fields.name = this.refs.loginName.value;
        }
        this.props.onFieldChange(fields);
    }

    onSubmit(event) {
        event.stopPropagation();
        event.preventDefault();
        this.props.onSubmit();
    }

    onRestorePasswordClick(event) {
        this.props.onRestorePassword(event);
    }

    getButtonTitle() {
        switch (this.props.type) {
            case LoginFormType.TYPE_LOGIN:
                return i18n("Log In");
            case LoginFormType.TYPE_REGISTER:
                return i18n("Register");
            case LoginFormType.TYPE_RESTORE:
                return i18n("Send new password");
        }
    }

    getNameItem() {
        return (
            <li key="name">
                <label htmlFor="loginName">{i18n("Name (optional)")}</label>
                <input type="text" value={this.props.name} onChange={this.onFieldChange}
                       ref="loginName" id="loginName"/>
            </li>);
    }

    getEmailItem() {
        return (
            <li key="email">
                <label htmlFor="loginEmail">{i18n("Email")}</label>
                <input type="email" value={this.props.email} onChange={this.onFieldChange}
                       ref="loginEmail" id="loginEmail"/>
            </li>);
    }

    getPasswordItem() {
        return (
            <li key="password">
                <label htmlFor="loginPassword">{i18n("Password")}</label>
                <input type="password" value={this.props.password}
                       onChange={this.onFieldChange}
                       ref="loginPassword" id="loginPassword"/>
            </li>);
    }

    getFormItems() {
        switch (this.props.type) {
            case LoginFormType.TYPE_LOGIN:
                return [
                    this.getEmailItem(),
                    this.getPasswordItem(),
                    <li className="no-border" key="restore">
                        <button onClick={this.onRestorePasswordClick} className="button-link id-restore-password" type="button">
                            {i18n("Restore password")}
                        </button>
                    </li>
                ];
            case LoginFormType.TYPE_REGISTER:
                return [
                    this.getNameItem(),
                    this.getEmailItem(),
                    this.getPasswordItem()
                ];
            case LoginFormType.TYPE_RESTORE:
                return [
                    this.getEmailItem()
                ];
        }
    }

    render() {
        return (
            <form action="#">
                <ul className={"popup-menu " + this.props.type}>
                    {this.getFormItems()}
                    <li className="submit">
                        <button onClick={this.onSubmit} type="submit">
                            {this.getButtonTitle()}
                        </button>
                    </li>
                </ul>
            </form>);
    }
}
