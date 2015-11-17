import React, {Component, PropTypes} from "react";
import i18n from "core/i18n";
import Link from "components/Link/Link";

export default class UserMenu extends Component {
    static propTypes = {
        onLogout: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);

        this.onLogoutClick = this.onLogoutClick.bind(this);
    }

    onLogoutClick(event) {
        event.preventDefault();
        this.props.onLogout();
    }

    render() {
        return (
            <ul className="popup-menu user-menu">
                <li>
                    <button onClick={this.onLogoutClick}
                       className="button-link id-logout">
                        {i18n("Log out")}
                    </button>
                </li>
            </ul>);
    }
}
