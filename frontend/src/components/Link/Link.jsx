var React = require("react");
var Application = require("core/Application");
var ObjectUtils = require("utils/ObjectUtils");

var Link = React.createClass({
    getInitialState: function() {
        return {};
    },

    getDefaultProps: function() {
        return {
            view: null,
            params: null
        };
    },

    onClick: function(event) {
        var params = ObjectUtils.clone(this.props.params || {});
        params.view = this.props.view.uri;
        Application.route(params, true);
        event.preventDefault();
    },

    render: function() {
        return (
            <a className={this.props.className} href={Application.makeViewUrl(this.props.view.uri, this.props.params)}
               onClick={this.onClick}>
                {this.props.children}
            </a>);
    }
});

module.exports = Link;
