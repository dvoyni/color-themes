import React, {Component, PropTypes} from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Filter from "../../components/Filter/Filter";
import PreviewList from "../../components/PreviewList/PreviewList";
import layouts from "../../layouts/layouts";
import Request from "../../core/Request";
import Application from "../../core/Application";
import i18n from "../../core/i18n";
import Themes from "../../store/Themes";
import Pager from "../../components/Pager/Pager";
import QueryParameters from "../../utils/QueryParameters";
import store from "../../store/store";
import IndexActions from "../../store/state/index";

import "./IndexView.less";

var ORDERS = [
    {value: "popular", label: "Popular first"},
    {value: "recent", label: "Recent first"}
];

var LAYOUTS = Object.keys(layouts).map(layout => ({value: layout, label: layout}));

export default class IndexView extends Component {
    static uri = "index";

    static get title() {
        return i18n("IDE Color Themes")
    }

    static extractAdditionalProps(state) {
        return {
            currentView: state.currentView,
            user: state.user
        };
    }

    static propTypes = {
        page: PropTypes.string.isRequired,
        order: PropTypes.string.isRequired,
        search: PropTypes.string.isRequired,
        layout: PropTypes.string.isRequired,
        themes: PropTypes.arrayOf(PropTypes.any).isRequired,
        totalThemes: PropTypes.number.isRequired,
        themesPerPage: PropTypes.number.isRequired,
        currentView: PropTypes.string.isRequired,
        user: PropTypes.shape({
            name: PropTypes.string.isRequired,
            email: PropTypes.string.isRequired,
            pending: PropTypes.bool.isRequired
        }).isRequired
    }

    filters = null

    constructor(props) {
        super(props);

        var bindOnFilterChange = (f, v) => this.onFilterChange(f, v);
        this.filters = [
            {id: "layout", label: "Preview", values: LAYOUTS, onChange: bindOnFilterChange},
            {id: "order", label: "Order", values: ORDERS, onChange: bindOnFilterChange}
        ];
    }

    onFilterChange(filterId, value) {
        switch (filterId) {
            case "layout":
                store.dispatch(IndexActions.setLayout(value));
                break;
            case "order":
                store.dispatch(IndexActions.setOrder(value));
                break;
        }
    }

    onSearchChange(search) {
        store.dispatch(IndexActions.setSearch(search));
    }

    updateUrl() {
        history.pushState(null, null, "?" + QueryParameters.stringify(this.getPageParams()));
    }

    getPageParams() {
        return {
            layout: this.props.layout,
            order: this.props.order,
            search: this.props.search,
            page: this.props.page,
            view: IndexView.uri
        }
    }

    render() {
        var params = this.getPageParams();
        var page = parseInt(this.props.page, 10);
        var totalPages = Math.floor(this.props.totalThemes / this.props.themesPerPage) +
            Math.min(1, this.props.totalThemes % this.props.themesPerPage);

        return (
            <div id="index-view">
                <Header currentView={IndexView} user={this.props.user} />
                <Filter ref="filter"
                        filters={this.filters}
                        filterValues={{layout: this.props.layout, order: this.props.order}}
                        search={this.props.search}
                        onSearchChange={s => this.onSearchChange(s)}/>
                { (this.props.themes.length > 0) ?
                    (<div>
                        <Pager view={IndexView} params={params} current={page} count={totalPages}/>
                        <PreviewList ref="list" themes={this.props.themes}
                                     layout={layouts[this.props.layout]}/>
                        <Pager view={IndexView} params={params} current={page} count={totalPages}/>
                        <Footer />
                    </div>)
                    :
                    (<div></div>)
                    }
            </div>);
    }
}
