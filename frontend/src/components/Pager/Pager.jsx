var React = require("react");
var Link = require("components/Link/Link");
var ObjectUtils = require("utils/ObjectUtils");

require("./Pager.less");

var Pager = React.createClass({
    getInitialState() {
        return {};
    },

    getDefaultProps() {
        return {
            count: 1,
            current: 0,
            view: null,
            params: null,
            paramName: "page"
        };
    },

    componentDidMount() {
    },

    componentWillUnmount() {
    },

    render() {
        var buttons = [];
        for (var i = 1; i <= this.props.count; i++) {
            var params = ObjectUtils.clone(this.props.params || {});
            params[this.props.paramName] = i;
            buttons.push(<Link view={this.props.view}
                               params={params}
                               className={i === this.props.current ? "current" : ""}>{i}</Link>);
        }

        return (<div className="pager">{buttons}</div>);
    }
});

module.exports = Pager;
