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
        className="card location-card shadow-sm mb-2"
      >
        <div className="card-header d-flex flex-row justify-content-between">
          <h6 className="card-title m-0 p-0 d-flex align-self-center">
            {result.name}
          </h6>
          <div className="flex-fill location-buttons">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={constructDirectionsUrl(result)}
              className="float-right btn btn-sm btn-outline-primary text-uppercase ml-1"
            >
              <i className="far fa-directions"></i>
            </a>
            <Link
              to={{ pathname: "/update", state: { item: removeSafety(entry) } }}
              className="float-right btn btn-sm btn-outline-success text-uppercase ml-1"
              onClick={recordUpdateStore}
            >
              <i className="far fa-pencil"></i> Update
            </Link>
          </div>
        </div>
        <div className="card-body">
          <ResultEntry entries={result.entries} />
        </div>
      </div>
    );
  }
}
