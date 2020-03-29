import React from "react";
import Result from "./Result";

export default class ResultBlock extends React.Component {
  render() {
    return (
      <div className="my-3">
        <div>
          <h4>{this.props.result.name}</h4>
        </div>
        <div>
          <Result {...this.props.result.entries} />
        </div>
      </div>
    );
  }
}

