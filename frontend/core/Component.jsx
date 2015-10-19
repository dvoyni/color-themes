import React from "react";
import ObjectUtils from "../utils/ObjectUtils.jsx";

export default class Component extends React.Component {
    bind(ctor) {
        Object.keys(ctor.prototype).
            filter(name => ObjectUtils.isFunction(this.constructor[name]) && (name.indexOf("on") === 0)).
            forEach(name => this[name] = this[name].bind(this));
    }
}
