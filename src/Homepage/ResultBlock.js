import React from "react";
import PropTypes from "prop-types";
import ResultEntry from "./Result";
import { Link } from "react-router-dom";
import { recordUpdateStore, recordDirectionsClicked } from "../gaEvents";
import Highlighter from "react-highlight-words";
import { withGlobalContext } from "../App";

function constructDirectionsUrl({ name, placeId, lat, lng }) {
  if (placeId) {
    return `https://www.google.com/maps/search/?api=1&query=${name}&query_place_id=${placeId}`;
  } else {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }
}

function prepareStoreForUpdate(entry) {
  return {
    ...entry,
    "Safety Observations": "",
    "Useful Information": "",
    "Opening Time": "",
    "Closing Time": "",
    "Store Category":
      entry["Store Category"] && entry["Store Category"].length
        ? entry["Store Category"][0]
        : "",
  };
}

class ResultBlock extends React.Component {
  static propTypes = {
    translations: PropTypes.object.isRequired,
  };

  onClick() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    this.props.onClick && this.props.onClick(this.props.result);
  }

  render() {
    const { result } = this.props;
    const entry = result.entries.length ? result.entries[0] : undefined;
    return (
      <div
        onClick={() => this.onClick()}
        className={`card my-1 card-result-block ${
          this.props.isSelected ? "card-result-block-selected" : ""
          }`}
      >
        <div className="card-body p-3">
          <a
            href={constructDirectionsUrl(result)}
            onClick={recordDirectionsClicked}
            target="_blank"
            rel="noopener noreferrer"
            className="float-right btn btn-sm btn-outline-secondary text-uppercase ml-2"
          >
            <i className="far fa-directions"></i>
          </a>
          <Link
            to={{
              pathname: "/update",
              state: { item: prepareStoreForUpdate(entry) },
            }}
            className="float-right btn btn-sm btn-outline-success text-uppercase"
            onClick={recordUpdateStore}
          >
            {this.props.translations.update}
          </Link>
          <h5 className="card-title m-0 p-0 d-inline-block">
            <Highlighter
              highlightClassName="highlighted-text"
              searchWords={[this.props.highlightedText]}
              autoEscape={true}
              textToHighlight={result.name}
            />
          </h5>
          {result.openTime && result.closeTime ? (
            <span className="mx-2">{`Hours: ${result.openTime} to ${result.closeTime}`}</span>
          ) : null}
          <ResultEntry
            highlightedText={this.props.highlightedText}
            entries={result.entries}
          />
        </div>
      </div>
    );
  }
}

export default withGlobalContext(ResultBlock);
