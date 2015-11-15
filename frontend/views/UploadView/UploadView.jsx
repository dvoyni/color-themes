import React, {Component, PropTypes} from "react";
import i18n from "../../core/i18n";
import Header from "../../components/Header/Header";
import User from "../../store/User";
import LoginPanel from "../../components/LoginPanel/LoginPanel";
import Application from "../../core/Application";
import * as Types from "../../components/PropTypes";
import Builders from "../../builders/Builders";
import Preview from "../../components/Preview/Preview";
import Layouts from "../../layouts/Layouts";
import PendingIcon from "../../components/PendingIcon/PendingIcon";
import Themes from "../../store/Themes";
import store from "../../store/store";
import CurrentViewActions from "../../store/state/currentView";
import ThemeView from "../../views/ThemeView/ThemeView";

import "./UploadView.less";

export default class UploadView extends Component {
    static uri = "upload";

    static get title() {
        var page = i18n("Upload"),
            title = i18n(Application.getConfigValue("brand"));

        return `${page} – ${title}`;
    }

    static propTypes = {
        user: Types.user.isRequired,
        layout: PropTypes.string.isRequired
    }

    static extractAdditionalProps(state) {
        return {
            user: state.user,
            layout: state.index.layout
        };
    }

    constructor(props) {
        super(props);

        this.onInstructionsClick = this.onInstructionsClick.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onFileSelect = this.onFileSelect.bind(this);
        this.onLayoutChange = this.onLayoutChange.bind(this);

        this.state = {
            styles: null,
            layout: props.layout,
            title: "",
            description: "",
            confirmed: false,
            pending: false
        }

        this.onInstructionsClick = this.onInstructionsClick.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onFileSelect = this.onFileSelect.bind(this);
        this.onLayoutChange = this.onLayoutChange.bind(this);
        this.onTitleChange = this.onTitleChange.bind(this);
        this.onDescriptionChange = this.onDescriptionChange.bind(this);
        this.onConfirmedChange = this.onConfirmedChange.bind(this);
    }

    onInstructionsClick(event) {
        event.preventDefault();
        event.stopPropagation();
        event.target.blur();

        var id = event.target.getAttribute("data-id");
        var instructions = document.getElementById(id);
        if (instructions.classList.contains("visible")) {
            instructions.classList.remove("visible");
        }
        else {
            instructions.classList.add("visible");
        }
    }

    onTitleChange(event) {
        this.setState({title: event.target.value});
    }

    onDescriptionChange(event) {
        this.setState({description: event.target.value});
    }

    onConfirmedChange(event) {
        this.setState({confirmed: event.target.checked});
    }

    onSubmit(event) {
        event.preventDefault();
        event.stopPropagation();
        this.setState({pending: true});

        Themes.uploadTheme_p(this.state.title, this.state.styles, this.state.description)
            .then(theme => {
                store.dispatch(CurrentViewActions.showView(ThemeView.uri, {id: theme._id}));
            })
            .catch(err => {
                this.setState({pending: false});
                Application.showError(err);
            })
    }

    onFileSelect(event) {
        var files = event.target.files;

        if (files && files.length > 0) {
            var file = files[0];
            if (file) {
                var fileName = file.name;
                var reader = new FileReader();
                reader.onload = () => {
                    var fileContent = reader.result;

                    Promise.all(Object.keys(Builders).map(name => Builders[name].parseStyles_p(fileName, fileContent)))
                        .then(styles => {
                            var themeStyles = styles.filter(style => style)[0];
                            this.setState({styles: themeStyles});
                            if (!themeStyles) {
                                throw i18n("File format is not supported");
                            }
                        })
                        .catch(err => Application.showError(err));
                };
                reader.readAsText(file);
            }
        }
    }

    onLayoutChange(event) {
        this.setState({layout: event.target.value});
    }

    renderAuthRequired() {
        return (
            <div className="wrapper">
                <h2>{i18n("Authentication required")}</h2>
                <p>{i18n("You have to be logged in to upload a theme.")}</p>
                <div className="login-panel-wrapper">
                    <LoginPanel user={this.props.user}/>
                </div>
            </div>);
    }

    renderPreview() {
        if (this.state.styles) {
            return (
                <div className="preview-wrapper">
                    <div className="header">
                        <div className="title">Preview</div>
                        <div>
                            <label htmlFor="preview-layout">{i18n("Layout")}
                                :</label>
                            <select id="preview-layout"
                                    onChange={this.onLayoutChange}
                                    value={this.state.layout}>
                                {Object.keys(Layouts).map(value =>
                                    (<option key={value} value={value}>
                                        {i18n(value)}
                                    </option>))}
                            </select>
                        </div>
                    </div>
                    <Preview styles={this.state.styles}
                             layout={Layouts[this.state.layout]}/>
                </div>)
        }
    }

    renderForm() {
        var licenseLink = "<a href='http://creativecommons.org/licenses/by-sa/3.0/'>Create Commons Attribution-ShareAlike (BY-SA)</a>";
        var allowSubmit = this.state.title && this.state.styles && this.state.confirmed && !this.state.pending;

        return (
            <form action="#">
                <div className="input-field">
                    <label htmlFor="upload-theme-title">{i18n("Name")}</label>
                    <input type="text" id="upload-theme-title" onChange={this.onTitleChange}/>
                </div>
                <div className="input-field">
                    <label htmlFor="upload-theme-description">{i18n("Description (optional)")}</label>
                    <textarea id="upload-theme-description" onChange={this.onDescriptionChange}></textarea>
                </div>
                <div className="input-field">
                    <label htmlFor="upload-theme-file">{i18n("Theme file")}</label>
                    <input type="file" id="upload-theme-file" onChange={this.onFileSelect}/>
                </div>
                <div>
                    {i18n("Instructions")}
                    <ul className="instructions-list">
                        {Object.keys(Builders)
                            .filter(name => !!Builders[name].instructions)
                            .map(name =>
                        <li key={name}>
                            <button className="button-link" data-id={name} onClick={this.onInstructionsClick}>
                                {i18n(name)}
                            </button>
                            <div id={name} className="instructions"
                                 dangerouslySetInnerHTML={{__html:i18n(Builders[name].instructions())}}></div>
                        </li>)}
                    </ul>
                </div>
                {this.renderPreview()}
                <div className="field">
                    <input type="checkbox" id="upload-author-check" onChange={this.onConfirmedChange}/>
                    <label htmlFor="upload-author-check" dangerouslySetInnerHTML={{
                        __html: i18n("I confirm that I am the author of the theme and I agree that it will be released under the ${license} license.", {license: licenseLink})
                        }}/>
                </div>
                <button type="submit" disabled={!allowSubmit} onClick={this.onSubmit}>{i18n("Upload")}</button>
                { this.state.pending ? <PendingIcon /> : <div></div>}
            </form>);
    }

    renderBody() {
        if (!this.props.user.email) {
            return this.renderAuthRequired();
        }
        else {
            return this.renderForm();
        }
    }

    render() {
        var email = Application.getConfigValue("email");
        var emailLink = `<a href='mailto:${email}'>${email}</a>`;

        return (
            <div id="upload-view">
                <Header user={this.props.user} currentView={UploadView}/>
                <div className="single-column-wrapper">
                    <div className="spacer"></div>
                    <div className="content">
                        <h1>{i18n("Upload new Theme")}</h1>
                        {this.renderBody()}
                        <div className="disclaimer" dangerouslySetInnerHTML={{ __html: i18n(
                            "If you experiencing any trouble with uploading – feel free to write a message to ${email}. We will help you.",
                            {email: emailLink})}}></div>
                    </div>
                    <div className="spacer"></div>
                </div>
            </div>);
    }
}
