import React, {Component, PropTypes} from "react";
import Link from "../../components/Link/Link";

import "./Pager.less";

export default class Pager extends Component {
    static propTypes = {
        count: PropTypes.number.isRequired,
        current: PropTypes.number.isRequired,
        view: PropTypes.func.isRequired,
        params: PropTypes.object,
        paramName: PropTypes.string
    }

    static defaultProps = {
        params: {},
        paramName: "page"
    }

    render() {
        var buttons = [];
        for (var i = 1; i <= this.props.count; i++) {
            var params = Object.assign({}, this.props.params, {[this.props.paramName]: String(i)});
            buttons.push(<Link view={this.props.view}
                               params={params}
                               className={i === this.props.current ? "current" : ""}
                               key={i}>{i}</Link>);
        }

        return (<div className="pager">{buttons}</div>);
    }
}
