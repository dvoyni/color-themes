var React = require("react");
var i18n = require("core/i18n");

var LoginForm = React.createClass({
    statics: {
        TYPE_LOGIN: 0,
        TYPE_REGISTER: 1
    },

    getInitialState() {
        return {};
    },

    getDefaultProps() {
        return {
            type: 0,
            onSubmit: null,
            onFieldChange: null,
            name: "",
            email: "",
            password: ""
        };
    },

    componentDidMount() {
    },

    componentWillUnmount() {
    },

    onFieldChange(event) {
        event.stopPropagation();
        if (this.props.onFieldChange) {
            var fields = {
                email: this.refs.loginEmail.getDOMNode().value,
                password: this.refs.loginPassword.getDOMNode().value
            }
            if (this.refs.loginName) {
                fields.name = this.refs.loginName.getDOMNode().value;
            }
            this.props.onFieldChange(fields);
        }
    },

    onSubmit(event) {
        event.stopPropagation();
        if (this.props.onSubmit) {
            this.props.onSubmit();
        }
    },

    render() {
        return (
            <ul className={"popup-menu " +
                 ((this.props.type === LoginForm.TYPE_LOGIN) ? "login" : "register")}>
                {(this.props.type === LoginForm.TYPE_LOGIN) ? [] :
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
                    <button onClick={this.onSubmit}>
                        {(this.props.type === LoginForm.TYPE_LOGIN) ? i18n("Log In") : i18n("Register")}
                    </button>
                </li>
            </ul>);
    }
});

module.exports = LoginForm;
