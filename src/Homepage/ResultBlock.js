import React from "react";
import { Link } from "react-router-dom";
import _ from 'lodash'
import Result from "./Result";
import * as api from "../api";


export default class ResultBlock extends React.Component {
  render() {
    const grouped = _.groupBy(this.props.results, 'Store Name')
      return (
       Object.keys(grouped).map(store => (
        <div className="my-3">
          <div>
            <h4>{store}</h4>
          </div>
          <div>
            <Result {...grouped[store]} />
          </div>
        </div>
      ))
    );
  }
}

