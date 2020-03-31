import React from "react";
import ResultEntry from "./Result";
import { Link } from "react-router-dom";

export default class MissingBlock extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { result } = this.props;
    const entry = result.entries.length ? result.entries[0] : undefined;
    return (
      <div
        className={`card my-3 ${this.props.missing ? 'text-white bg-info' : null}`}
      >
        <div className="card-body">
          <h5 className="card-title m-0 p-0">{result.name}</h5>
          <p className="card-text">We don't have information on this location yet - you can help out by adding some!</p>
          <Link
            to={{ pathname: "/update", state: { item: entry } }}
            className="btn btn-sm btn-outline-light text-uppercase"
          >
            Add
          </Link>

        </div>
      </div>
    );
  }
}
