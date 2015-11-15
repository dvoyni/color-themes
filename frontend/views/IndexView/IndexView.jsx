import React, {Component, PropTypes} from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Filter from "../../components/Filter/Filter";
import PreviewList from "../../components/PreviewList/PreviewList";
import Layouts from "../../layouts/Layouts";
import Request from "../../core/Request";
import Application from "../../core/Application";
import i18n from "../../core/i18n";
import Themes from "../../store/Themes";
import Pager from "../../components/Pager/Pager";
import QueryParameters from "../../utils/QueryParameters";
import store from "../../store/store";
import IndexActions from "../../store/state/index";
import * as Types from "../../components/PropTypes";
import PendingIcon from "../../components/PendingIcon/PendingIcon";

import "./IndexView.less";

var ORDERS = [
    {value: "popular", label: "Popular first"},
    {value: "recent", label: "Recent first"}
];

var LAYOUTS = Object.keys(Layouts).map(layout => ({value: layout, label: layout}));

export default class IndexView extends Component {
    static uri = "index";

    static get title() {
        return i18n(Application.getConfigValue("brand"));
    }

    static extractAdditionalProps(state) {
        return {
            user: state.user
        };
    }

    static propTypes = {
        page: PropTypes.any.isRequired,
        order: PropTypes.string.isRequired,
        search: PropTypes.string.isRequired,
        layout: PropTypes.string.isRequired,
        themes: PropTypes.arrayOf(Types.theme).isRequired,
        totalThemes: PropTypes.number.isRequired,
        themesPerPage: PropTypes.number.isRequired,
        user: Types.user.isRequired
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
                                     layout={Layouts[this.props.layout]}/>
                        <Pager view={IndexView} params={params} current={page} count={totalPages}/>
                        <Footer />
                    </div>)
                    :
                    (<PendingIcon />)
                    }
            </div>);
    }
}
