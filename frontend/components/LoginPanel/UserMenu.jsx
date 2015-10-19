import React from "react";
import Component from "../../core/Component.jsx";
import i18n from "core/i18n";
import Link from "components/Link/Link";

export default class UserMenu extends Component {
    static defaultProps = {
        onLogout: null
    };

    constructor(props) {
        super(props);
    }

    onLogoutClick(event) {
        event.preventDefault();
        if (this.props.onLogout) {
            this.props.onLogout();
        }
    }

    render() {
        /*<li>
         <Link view={require("views/IndexView/IndexView")}>
         {i18n("Edit profile")}
         </Link>
         </li>*/
        return (
            <ul className="popup-menu user-menu">
                <li>
                    <a href="#" onClick={::this.onLogoutClick}
                       className="no-redirect ignore-visited">
                        {i18n("Log out")}
                    </a>
                </li>
            </ul>);
    }
}
