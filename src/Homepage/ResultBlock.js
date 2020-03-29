import React from "react";
import { Link } from "react-router-dom";
import _ from 'lodash'
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

