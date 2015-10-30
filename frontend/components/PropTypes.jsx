import {PropTypes} from "react";

export var user = PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    pending: PropTypes.bool.isRequired,
    isPremium: PropTypes.bool.isRequired
});

export var theme = PropTypes.any;
