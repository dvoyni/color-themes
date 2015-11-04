import React, {Component, PropTypes} from "react";
import i18n from "../../core/i18n";

export var LoginFormType = {
    TYPE_LOGIN: "TYPE_LOGIN",
    TYPE_REGISTER: "TYPE_REGISTER"
}

export default class LoginForm extends Component {
    static propTypes = {
        type: PropTypes.oneOf([LoginFormType.TYPE_LOGIN, LoginFormType.TYPE_REGISTER]),
        onSubmit: PropTypes.func.isRequired,
        onFieldChange: PropTypes.func.isRequired,
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        password: PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);

        this.onFieldChange = this.onFieldChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onFieldChange(event) {
        event.stopPropagation();
        var fields = {
            email: this.refs.loginEmail.value,
            password: this.refs.loginPassword.value
        }
        if (this.refs.loginName) {
            fields.name = this.refs.loginName.value;
        }
        this.props.onFieldChange(fields);
    }

    onSubmit(event) {
        event.stopPropagation();
        this.props.onSubmit();
    }

    render() {
        return (
            <ul className={"popup-menu " +
                 ((this.props.type === LoginFormType.TYPE_LOGIN) ? "login" : "register")}>
                {(this.props.type === LoginFormType.TYPE_LOGIN) ? [] :
                    <li>
                        <label htmlFor="loginName">{i18n("Name (optional)")}</label>
                        <input type="text" value={this.props.name} onChange={this.onFieldChange}
                               ref="loginName" id="loginName"/>
                    </li>
                    }
                <li>
                    <label htmlFor="loginEmail">{i18n("Email")}</label>
                    <input type="email" value={this.props.email} onChange={this.onFieldChange}
                           ref="loginEmail" id="loginEmail"/>
                </li>
                <li>
                    <label htmlFor="loginPassword">{i18n("Password")}</label>
                    <input type="password" value={this.props.password}
                           onChange={this.onFieldChange}
                           ref="loginPassword" id="loginPassword"/>
                </li>
                <li className="submit">
                    <button onClick={this.onSubmit} type="submit">
                        {(this.props.type === LoginFormType.TYPE_LOGIN) ? i18n("Log In") : i18n("Register")}
                    </button>
                </li>
            </ul>);
    }
}
