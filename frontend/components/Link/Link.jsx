import React, {Component, PropTypes} from "react";
import store from "../../store/store";
import CurrentViewActions from "../../store/state/currentView";
import Application from "../../core/Application";

export default class Link extends Component {
    static propTypes = {
        view: PropTypes.func.isRequired,
        params: PropTypes.object
    }

    defaultProps = {
        params: {}
    }

    onClick(event) {
        event.preventDefault();
        store.dispatch(CurrentViewActions.showView(this.props.view.uri, this.props.params));
    }

    render() {
        return (
            <a className={this.props.className}
               href={Application.makeViewUrl(this.props.view.uri, this.props.params)}
               onClick={e => this.onClick(e)}>
                {this.props.children}
            </a>);
    }
}
