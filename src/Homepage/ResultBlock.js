import React from "react";
import ResultEntry from "./Result";
import {Link} from "react-router-dom";
import {recordAddInfoToStoreCard, recordUpdateStore} from "../gaEvents";

function removeSafety(entry) {
    return {
        ...entry,
        "Safety Observations": "",
        "Useful Information": ""
    };
}

export default class ResultBlock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hover: false
        };
    }

    onClick() {
        window.scrollTo({
            top: 50,
            behavior: "smooth"
        });
        this.props.onClick && this.props.onClick(this.props.result);
    }

    render() {
        const {result} = this.props;
        const entry = result.entries.length ? result.entries[0] : undefined;
        return (
            <div
                onClick={() => this.onClick()}
                onMouseEnter={() => this.setState({hover: true})}
                onMouseLeave={() => this.setState({hover: false})}
                className="card location-card my-1"
                style={{
                    cursor: "pointer",
                    backgroundColor: this.state.hover ? "#eee" : "white"
                }}
            >
                <div className="card-header d-flex flex-row justify-content-between">
                    <h6 className="card-title m-0 p-0 d-flex align-self-center">{result.name}</h6>
                    <div className="flex-fill location-buttons">
                        <Link
                            to={{pathname: "/update", state: {item: removeSafety(entry)}}}
                            className="float-right btn btn-sm btn-outline-success text-uppercase ml-1"
                            onClick={recordUpdateStore}
                        >
                            <i className="far fa-pencil"></i> Update
                        </Link>
                        <Link
                            to={{pathname: "/update", state: {item: entry}}}
                            className="float-right btn btn-sm btn-outline-primary text-uppercase ml-1 d-none"
                            onClick={recordAddInfoToStoreCard}
                        >
                            <i className="far fa-phone"></i> Call
                        </Link>
                        <Link
                            to={{pathname: "/update", state: {item: entry}}}
                            className="float-right btn btn-sm btn-outline-primary text-uppercase ml-1"
                            onClick={recordAddInfoToStoreCard}
                        >
                            <i className="far fa-directions"></i> Directions
                        </Link>
                    </div>
                </div>
                <div className="card-body">
                    <ResultEntry entries={result.entries}/>
                </div>
            </div>
        );
    }
}
