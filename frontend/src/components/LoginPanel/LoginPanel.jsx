var React = require("react");
var i18n = require("core/i18n");
var User = require("store/User");
var Application = require("core/Application");
var LoginForm = require("./LoginForm");
var UserMenu = require("./UserMenu");

require("./LoginPanel.less");

var LoginPanel = React.createClass({
    getInitialState: function() {
        return {
            signedIn: false,
            pending: true,
            menu: false,
            loginForm: false,
            registerForm: false,
            name: "",
            email: "",
            password: ""
        };
    },

    getDefaultProps: function() {
        return {};
    },

    componentDidMount: function() {
        User.getInfo((err, userInfo) => {
            this.setState({
                signedIn: !!userInfo.email,
                name: userInfo.name,
                email: userInfo.email,
                pending: false
            });
        });
    },

    showMenu: function(event) {
        event.preventDefault();
        this.showForm("menu");
    },

    showLoginForm: function(event) {
        event.preventDefault();
        this.showForm("loginForm");
    },

    showRegisterForm: function(event) {
        event.preventDefault();
        this.showForm("registerForm");
    },

    showForm: function(name) {
        var state = {menu: false, loginForm: false, registerForm: false};
        if (!this.state[name]) {
            state[name] = true;
        }
        this.setState(state);
    },

    onLogout: function() {
        this.setState({pending: true});
        User.logout(() => {
            this.setState({
                signedIn: false,
                pending: false
            });
        });
    },

    onFieldChange: function(fields) {
        this.setState(fields);
    },

    onSubmit: function() {
        this.showForm();
        this.setState({pending: true});
        if (this.state.loginForm) {
            User.login(
                this.state.email,
                this.state.password,
                this.loggedIn.bind(this));
        }
        else {
            User.register(
                this.state.email,
                this.state.password,
                this.state.name,
                this.loggedIn.bind(this));
        }
    },

    loggedIn(err, userInfo) {
        if (err) {
            this.setState({pending: false});
            return Application.showError(err);
        }
        this.setState({
            pending: false,
            signedIn: !!userInfo.email,
            name: userInfo.name
        });
    },

    render: function() {
        if (this.state.pending) {
            return <div className="login-panel"></div>;
        }
        else if (this.state.signedIn) {
            return (
                <div className={"login-panel"}>
                    <a href="#" onClick={this.showMenu} className="no-redirect ignore-visited">
                        {this.state.name || this.state.email}
                    </a>
                    {!this.state.menu ? [] :
                        <UserMenu onLogout={this.onLogout} />
                    }
                </div>);
        }
        else {
            return (
                <div className="login-panel">
                    <a href="#" onClick={this.showLoginForm} className="no-redirect ignore-visited">
                        {i18n("Sign in")}
                    </a>
                    {i18n(" or ")}
                    <a href="#" onClick={this.showRegisterForm}
                       className="no-redirect ignore-visited">
                        {i18n("register")}
                    </a>
                    {(!this.state.loginForm && !this.state.registerForm) ? [] :
                        <LoginForm
                            type={this.state.loginForm ? LoginForm.TYPE_LOGIN : LoginForm.TYPE_REGISTER}
                            onSubmit={this.onSubmit} onFieldChange={this.onFieldChange}
                            name={this.state.name}
                            email={this.state.email}
                            password={this.state.password} />}
                </div>);
        }
    }
});

module.exports = LoginPanel;
