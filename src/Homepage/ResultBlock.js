import React from "react";
import Result from "./Result";

export default class ResultBlock extends React.Component {
  render() {
    return (
      <div className="card my-3">
        <div className="card-body">
          <h5 className="card-title">{this.props.result.name}</h5>
          <div>
            <Result entries={this.props.result.entries} />
          </div>
        </div>
      </div>
    );
  }
}

