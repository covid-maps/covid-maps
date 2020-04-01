import React from "react";
import ResultEntry from "./Result";
import { Link } from "react-router-dom";

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
        <div className="card-body">
          <Link
            to={{ pathname: "/update", state: { item: entry } }}
            className="float-right btn btn-sm btn-outline-success text-uppercase"
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
