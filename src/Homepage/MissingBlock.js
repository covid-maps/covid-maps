import React from "react";
import { Link } from "react-router-dom";
import { recordAddInfoToStoreCard } from "../gaEvents";
import CloseButton from "react-bootstrap/CloseButton";

export default class MissingBlock extends React.Component {
  render() {
    const { result } = this.props;
    const entry = result.entries.length ? result.entries[0] : undefined;
    return this.props.showMissing ? (
      <div
        className={`card my-2 ${
          this.props.missing ? "text-white bg-info" : null
        }`}
      >
        <div className="card-body p-3">
          <CloseButton
            className="float-right mt-n2 mr-n2 ml-1"
            onClick={this.props.onClose}
          />
          <h5 className="card-title m-0 p-0">{result.name}</h5>
          <p className="card-text">
            We don't have information on this location yet. Help out by adding
            some!
          </p>
          <Link
            to={{ pathname: "/update", state: { item: entry } }}
            className="btn btn-sm btn-outline-light text-uppercase"
            onClick={recordAddInfoToStoreCard}
          >
            Add
          </Link>
        </div>
      </div>
    ) : null;
  }
}
