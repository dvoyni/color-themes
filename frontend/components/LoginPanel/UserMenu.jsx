import React, {Component, PropTypes} from "react";
import i18n from "core/i18n";
import Link from "components/Link/Link";

export default class UserMenu extends Component {
    static propTypes = {
        onLogout: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);
    }

    onLogoutClick(event) {
        event.preventDefault();
        this.props.onLogout();
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
                    <a href="#" onClick={e => this.onLogoutClick(e)}
                       className="no-redirect ignore-visited">
                        {i18n("Log out")}
                    </a>
                </li>
            </ul>);
    }
}
