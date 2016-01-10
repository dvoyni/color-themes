import React, {Component, PropTypes} from "react";
import PreviewListItem from "../../components/PreviewListItem/PreviewListItem";
import * as Types from "../PropTypes";

require("./PreviewList.less");

var adCoefficient = 15;

export default class PreviewList extends Component {
    static propTypes = {
        layout: React.PropTypes.object.isRequired,
        themes: PropTypes.arrayOf(Types.theme).isRequired
    }

    componentDidMount() {
        var adCount = Math.ceil(this.props.themes.length / adCoefficient);
        adsbygoogle = window.adsbygoogle || [];
        for (var i = 0; i < adCount; i++) {
            adsbygoogle.push({});
        }
    }

    render() {
        var prepared = this.props.themes.slice();

        var adCount = Math.ceil(this.props.themes.length / adCoefficient);
        for (var i = 0; i < adCount; i++) {
            prepared.splice(i * 15 + Math.floor(Math.random() * (adCoefficient-2)) + 1, 0, {ad: true});
        }

        return (
            <div className="preview-list" ref="list">
                {prepared.map(theme => theme.ad ?
                    <div className="ad">
                        <ins className="adsbygoogle"
                             style={{display:"inline-block",width:"336px",height:"280px"}}
                             data-ad-client="ca-pub-8538465790539239"
                             data-ad-slot="6773128704"></ins>
                    </div> :
                    <PreviewListItem theme={theme} layout={this.props.layout} key={theme._id}/>)}
            </div>);
    }
}
