import React from "react";
import Component from "../../core/Component.jsx";
import Application from "../../core/Application";
import ObjectUtils from "../../utils/ObjectUtils";

export default class Link extends Component {
    static defaultProps = {
        view: null,
        params: null
    };

    onClick(event) {
        event.preventDefault();
        var params = ObjectUtils.clone(this.props.params || {});
        params.view = this.props.view.uri;
        Application.route(params, true);
    }

    render() {
        return (
            <a className={this.props.className}
               href={Application.makeViewUrl(this.props.view.uri, this.props.params)}
               onClick={::this.onClick}>
                {this.props.children}
            </a>);
    }
}
