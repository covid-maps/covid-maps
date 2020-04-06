import React from "react";
import ResultEntry from "./Result";
import { Link } from "react-router-dom";
import { recordUpdateStore } from "../gaEvents";

function constructDirectionsUrl({ name, placeId, lat, lng }) {
  if (placeId) {
    return `https://www.google.com/maps/search/?api=1&query=${name}&query_place_id=${placeId}`;
  } else {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }
}

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
      top: 0,
      behavior: "smooth"
    });
    this.props.onClick && this.props.onClick(this.props.result);
  }

  render() {
    const { result } = this.props;
    const entry = result.entries.length ? result.entries[0] : undefined;
    return (
      <div
        onClick={() => this.onClick()}
        onMouseEnter={() => this.setState({ hover: true })}
        onMouseLeave={() => this.setState({ hover: false })}
        className="card my-1"
        style={{
          cursor: "pointer",
          backgroundColor: this.state.hover ? "#eee" : "white"
        }}
      >
        <div className="card-body p-3">
          <a
            href={constructDirectionsUrl(result)}
            target="_blank"
            rel="noopener noreferrer"
            className="float-right btn btn-sm btn-outline-secondary text-uppercase ml-2"
          >
            <i className="far fa-directions"></i>
          </a>
          <Link
            to={{ pathname: "/update", state: { item: removeSafety(entry) } }}
            className="float-right btn btn-sm btn-outline-success text-uppercase"
            onClick={recordUpdateStore}
          >
            Update
          </Link>
          <h5 className="card-title m-0 p-0">{result.name}</h5>
          <ResultEntry entries={result.entries} />
        </div>
      </div>
    );
  }
}
