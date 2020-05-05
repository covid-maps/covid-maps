import React, { Component } from "react";
import PropTypes from "prop-types";
import { withGlobalContext } from "./App";

class PageLoader extends Component {
    static propTypes = {
        showLoader: PropTypes.bool.isRequired
    }

    render() {
        return this.props.showLoader && (
            <div className="text-center py-5">
                <div className="spinner-border text-secondary" role="status">
                <span className="sr-only">Loading...</span>
                </div>
            </div>
        );
    }
}

export default withGlobalContext(PageLoader);