var React = require("react");
var i18n = require("core/i18n");
var Dispatcher = require("core/Dispatcher");

require("./Filter.less");

var Filter = React.createClass({

    getInitialState: function() {
        return {};
    },

    getDefaultProps: function() {
        return {
            filters: [/*{
             id: "...",
             label: "...",
             values: [{value: "...", label: "..."}, ...],
             onChange: fn()
             }, ...*/],
            filterValues: {},
            onSearchChange: null,
            search: ""
        };
    },

    onSearchChange: function(event) {
        var search = event.target.value;
        if (this.props.onSearchChange) {
            this.props.onSearchChange.call(null, search);
        }
    },

    onFilterChange(event) {
        var id = event.target.getAttribute("data-filter");
        this.props.filters.
            filter(filter => filter.id === id).
            forEach(filter => filter.onChange(id, event.target.value));
    },

    render: function() {
        return (
            <div className="filter">
                <div className="spacer"></div>
                {this.props.filters.map(filter =>
                        <div key={filter.id}>
                            <label htmlFor={"filter-" + filter.id}>{i18n(filter.label)}:</label>
                            <select id={"filter-" + filter.id}
                                    data-filter={filter.id}
                                    onChange={this.onFilterChange}
                                    value={this.props.filterValues[filter.id]}>
                                {filter.values.map(value =>
                                    <option key={value.value}
                                            value={value.value}>{i18n(value.label)}</option>)}
                            </select>
                        </div>
                )}

                <div>
                    <label htmlFor="input-search">{i18n("Search:")}</label>
                    <input type="search" id="input-search"
                           onChange={this.onSearchChange}
                           value={this.props.search}/>
                </div>
            </div>);
    }
});

module.exports = Filter;
