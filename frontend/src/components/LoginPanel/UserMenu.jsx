var React = require("react");
var i18n = require("core/i18n");
var Link = require("components/Link/Link");

var UserMenu = React.createClass({
    getInitialState() {
        return {};
    },

    getDefaultProps() {
        return {
            onLogout: null
        };
    },

    componentDidMount() {
    },

    componentWillUnmount() {
    },

    onLogoutClick(event) {
        event.preventDefault();
        if (this.props.onLogout) {
            this.props.onLogout();
        }
    },

    render() {
        /*<li>
         <Link view={require("views/IndexView/IndexView")}>
         {i18n("Edit profile")}
         </Link>
         </li>*/
        return (
            <ul className="popup-menu user-menu">
                <li>
                    <a href="#" onClick={this.onLogoutClick}
                       className="no-redirect ignore-visited">
                        {i18n("Log out")}
                    </a>
                </li>
            </ul>);
    }
});

module.exports = UserMenu;
