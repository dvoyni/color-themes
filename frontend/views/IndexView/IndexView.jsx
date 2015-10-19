import React from "react";
import Component from "../../core/Component.jsx";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Filter from "../../components/Filter/Filter";
import PreviewList from "../../components/PreviewList/PreviewList";
import layouts from "../../layouts/layouts";
import Dispatcher from "../../core/Dispatcher";
import Request from "../../core/Request";
import Application from "../../core/Application";
import i18n from "../../core/i18n";
import Themes from "../../store/Themes";
import Pager from "../../components/Pager/Pager";
import QueryParameters from "../../utils/QueryParameters";
import Store from "../../core/Store";

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

    static defaultProps = {
        page: 1,
        layout: LAYOUTS[0].value,
        order: ORDERS[0].value,
        search: ""
    };

    state = {
        layout: IndexView.defaultProps.layout,
        order: IndexView.defaultProps.order,
        search: IndexView.defaultProps.search,
        themes: [],
        totalPages: 0
    };

    store = new Store();
    pendingThemesXhr = null;

    componentDidMount() {
        this.store.dispatcher.on("change", ::this.onStoreChange);
        this.store.dispatcher.on("availableChange", ::this.onAvailableChange);
        this.requestPage();
    }

    requestPage() {
        if (this.pendingThemesXhr) {
            this.pendingThemesXhr.abort();
        }
        this.pendingThemesXhr = Themes.getPage(this.props.page - 1, this.state.search,
            this.state.order, this.store);
    }

    onStoreChange(store) {
        this.setState({themes: store.items});
        this.pendingThemesXhr = null;
    }

    onFilterChange(filterId, value) {
        var state = {};
        state[filterId] = value;
        this.setState(state, () => {
            this.updateUrl();
            if (filterId !== "layout") {
                this.requestPage();
            }
        });
    }

    onSearchChange(search) {
        this.setState({search: search}, () => {
            this.updateUrl();
            this.requestPage();
        });
    }

    onAvailableChange(store) {
        this.setState({totalPages: store.available});
    }

    updateUrl() {
        history.pushState(null, null, "?" + QueryParameters.stringify(this.getPageParams()));
    }

    getPageParams() {
        return {
            layout: this.state.layout,
            order: this.state.order,
            search: this.state.search,
            page: this.props.page,
            view: IndexView.uri
        }
    }

    render() {
        var params = this.getPageParams();
        return (
            <div id="index-view">
                <Header/>
                <Filter ref="filter"
                        filters={[
                            {id: "layout", label: "Preview", values: LAYOUTS, onChange: ::this.onFilterChange},
                            {id: "order", label: "Order", values: ORDERS, onChange: ::this.onFilterChange}
                        ]}
                        filterValues={{layout: this.state.layout, order: this.state.order}}
                        search={this.state.search}
                        onSearchChange={::this.onSearchChange}/>
                <Pager view={IndexView} params={params} current={this.props.page}
                       count={this.state.totalPages}/>
                <PreviewList ref="list" themes={this.state.themes}
                             layout={layouts[this.state.layout]}/>
                <Pager view={IndexView} params={params} current={this.props.page}
                       count={this.state.totalPages}/>
                <Footer />
            </div>);
    }
}
