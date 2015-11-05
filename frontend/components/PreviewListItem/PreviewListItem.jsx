import React, {Component, PropTypes} from "react";
import Preview from "../Preview/Preview";
import Application from "../../core/Application";
import ThemeView from "../../views/ThemeView/ThemeView";
import Link from "../Link/Link";
import * as Types from "../PropTypes";

import "./PreviewListItem.less";

import downloadIcon from "./download-icon.svg";

export default class PreviewListItem extends Component {
    static propTypes = {
        theme: Types.theme,
        layout: PropTypes.object.isRequired
    };

    render() {
        return (
            <Link view={ThemeView} params={{id: this.props.theme._id}} className="preview-list-item no-decoration">
                <Preview styles={this.props.theme.styles} layout={this.props.layout} className="preview"/>
                <div className="info">
                    <div className="title">{this.props.theme.title}</div>
                    <img src={downloadIcon} />
                    <div className="downloads">{this.props.theme.downloads}</div>
                </div>
            </Link>);
    }
}
