import React from "react";
import ResultEntry from "./Result";
import { Link } from "react-router-dom";

export default class ResultBlock extends React.Component {
  render() {
    const { result } = this.props;
    const entry = result.entries.length ? result.entries[0] : undefined;
    return (
      <div className="card my-3">
        <div className="card-body">
          <Link to={{ pathname: "/update", state: { item: entry } }} className="float-right btn btn-sm btn-outline-success text-uppercase">
            Update this information{" "}
          </Link>
          <h5 className="card-title">{result.name}</h5>
          <ResultEntry entries={result.entries} />
        </div>
      </div>
    );
  }
}
