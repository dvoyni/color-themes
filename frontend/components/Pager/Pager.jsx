import React from "react";
import Component from "../../core/Component.jsx";
import Link from "../../components/Link/Link";
import ObjectUtils from "../../utils/ObjectUtils";

import "./Pager.less";

export default class Pager extends Component {
    static defaultProps = {
        count: 1,
        current: 0,
        view: null,
        params: null,
        paramName: "page"
    };

    render() {
        var buttons = [];
        for (var i = 1; i <= this.props.count; i++) {
            var params = ObjectUtils.clone(this.props.params || {});
            params[this.props.paramName] = i;
            buttons.push(<Link view={this.props.view}
                               params={params}
                               className={i === this.props.current ? "current" : ""}
                               key={i}>{i}</Link>);
        }

        return (<div className="pager">{buttons}</div>);
    }
}
