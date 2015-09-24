var React = require("react");
var Header = require("components/Header/Header");
var Footer = require("components/Footer/Footer");
var Filter = require("components/Filter/Filter");
var PreviewList = require("components/PreviewList/PreviewList");
var layouts = require("layouts/layouts");
var Dispatcher = require("core/Dispatcher");
var Request = require("core/Request");
var Application = require("core/Application");
var i18n = require("core/i18n");
var Themes = require("store/Themes");
var Pager = require("components/Pager/Pager");
var QueryParameters = require("utils/QueryParameters");

require("./IndexView.less");

var THEMES_PER_PAGE = 40;

var ORDERS = [
    {value: "popular", label: "Popular first"},
    {value: "recent", label: "Recent first"}
];

var ORDER_SORT = {
    "popular": (a, b) => Math.max(-1, Math.min(1, b.downloads - a.downloads)),
    "recent": (a, b) => Math.max(-1, Math.min(1, new Date(b.date) - new Date(a.date)))
};

var LAYOUTS = Object.keys(layouts).map(layout => ({value: layout, label: layout}));

var IndexView = React.createClass({
    statics: {
        uri: "index",
        getTitle() {
            return i18n("IDE Color Themes")
        }
    },

    getInitialState() {
        return {
            layout: this.props.layout,
            order: this.props.order,
            search: this.props.search,
            filteredThemes: []
        };
    },

    getDefaultProps() {
        return {
            __updated: false,
            page: 1,
            layout: LAYOUTS[0].value,
            order: ORDERS[0].value,
            search: ""
        };
    },

    componentDidMount: function() {
        var UpdateView = require("views/UpdateView/UpdateView");

        if (!this.props.__updated && Themes.isUpdateRequired()) {
            Application.route({
                view: UpdateView.uri,
                nextView: {view: IndexView.uri, __updated: true}
            });
        }
        else {
            this.setState({filteredThemes: this.filterThemes(this.state.search)});
        }
    },

    componentWillUnmount() {
    },

    onFilterChange: function(filterId, value) {
        var state = {};
        state[filterId] = value;
        this.setState(state, this.updateUrl.bind(this));
    },

    onSearchChange: function(search) {

        this.setState({
            search: search,
            filteredThemes: this.filterThemes(search)
        }, this.updateUrl.bind(this));
    },

    filterThemes(search) {
        search = (search || "").toLowerCase();
        var themes = (Themes.getThemes() || []);
        if (search) {
            return themes.filter(theme =>
                (theme.title && theme.title.toLowerCase().indexOf(search) !== -1) ||
                (theme.comment && theme.comment.toLowerCase().indexOf(search) !== -1) ||
                (theme.author && theme.author.toLowerCase().indexOf(search) !== -1) ||
                (theme.website && theme.website.toLowerCase().indexOf(search) !== -1)
            );
        }

        return themes;
    },

    getPagesCount() {
        return Math.floor(this.state.filteredThemes.length / THEMES_PER_PAGE) +
            (this.state.filteredThemes.length % THEMES_PER_PAGE ? 1 : 0);
    },

    getCurrentPage() {
        return Math.min(this.getPagesCount(), parseInt(this.props.page || 0));
    },

    updateUrl() {
        history.pushState(null, null, "?" + QueryParameters.stringify(this.getPageParams()));
    },

    getPageParams() {
        return {
            layout: this.state.layout,
            order: this.state.order,
            search: this.state.search,
            page: this.getCurrentPage(),
            view: IndexView.uri
        }
    },

    render() {
        var pagesCount = this.getPagesCount();
        var currentPage = this.getCurrentPage();
        var start = THEMES_PER_PAGE * (currentPage - 1);
        var themes = this.state.filteredThemes.
            sort(ORDER_SORT[this.state.order]).
            slice(start, start + THEMES_PER_PAGE);
        var params = this.getPageParams();

        return (
            <div id="index-view">
                <Header/>
                <Filter ref="filter"
                        filters={[
                            {id: "layout", label: "Preview", values: LAYOUTS, onChange: this.onFilterChange.bind(this)},
                            {id: "order", label: "Order", values: ORDERS, onChange: this.onFilterChange.bind(this)}
                        ]}
                        filterValues={{layout: this.state.layout, order: this.state.order}}
                        search={this.state.search}
                        onSearchChange={this.onSearchChange}/>
                <Pager view={IndexView} params={params} current={currentPage}
                       count={pagesCount}/>
                <PreviewList ref="list" themes={themes} layout={layouts[this.state.layout]}/>
                <Pager view={IndexView} params={params} current={currentPage}
                       count={pagesCount}/>
                <Footer />
            </div>);
    }
});

module.exports = IndexView;
