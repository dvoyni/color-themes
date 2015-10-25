import React, {Component, PropTypes} from "react";
import i18n from "../../core/i18n";

import "./Filter.less";

export default class Filter extends Component {
    static propTypes = {
        filters: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            values: PropTypes.arrayOf(PropTypes.shape({
                value: PropTypes.string.isRequired,
                label: PropTypes.string.isRequired
            })).isRequired,
            onChange: PropTypes.func.isRequired
        })).isRequired,
        filterValues: PropTypes.object.isRequired,
        onSearchChange: PropTypes.func.isRequired,
        search: PropTypes.string.isRequired
    };

    onSearchChange(event) {
        var search = event.target.value;
        this.props.onSearchChange.call(null, search);
    }

    onFilterChange(event) {
        var id = event.target.getAttribute("data-filter");
        this.props.filters
            .filter(filter => filter.id === id)
            .forEach(filter => filter.onChange(id, event.target.value));
    }

    render() {
        return (
            <div className="filter">
                <div className="spacer"></div>
                {this.props.filters.map(filter =>
                    (<div key={filter.id}>
                        <label htmlFor={"filter-" + filter.id}>{i18n(filter.label)}:</label>
                        <select id={"filter-" + filter.id}
                                data-filter={filter.id}
                                onChange={e => this.onFilterChange(e)}
                                value={this.props.filterValues[filter.id]}>
                            {filter.values.map(value =>
                                (<option key={value.value} value={value.value}>
                                    {i18n(value.label)}
                                </option>))}
                        </select>
                    </div>)
                    )}

                <div>
                    <label htmlFor="input-search">{i18n("Search:")}</label>
                    <input type="search" id="input-search"
                           onChange={e => this.onSearchChange(e)}
                           value={this.props.search}/>
                </div>
            </div>);
    }
}
