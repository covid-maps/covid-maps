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
          <h5 className="card-title">{result.name}</h5>
          <div>
            <h6 className="card-subtitle mb-2">
              <Link to={{ pathname: "/update", state: { item: entry } }}>
                Update this information{" "}
              </Link>
            </h6>
          </div>
          <ResultEntry entries={result.entries} />
        </div>
      </div>
    );
  }
}
