import React from "react";
import { Link } from "react-router-dom";
import _ from 'lodash'

const humanizeDuration = require("humanize-duration");

function Timestamp({ Timestamp: value }) {
  const then = new Date(value);
  const now = new Date();
  return (
    <strong>
      {humanizeDuration(Math.abs(now - then), { largest: 1 })} ago
    </strong>
  );
}

function Result({ entries }) {
  const resultList = entries.filter(result => result["Useful Information"] || result["Safety Observations"]);
  return (
    resultList.map(result => (
      <div className="my-3">
        <div>
          {result["Safety Observations"] ? <div>{result["Safety Observations"]}</div> : null}
          {result["Useful Information"] ? <div>{result["Useful Information"]}</div> : null}
          
        </div>
        <div className="card-link" style={{ fontSize: '0.8em' }}>
          <Link to={{ pathname: "/submit", state: { item: result } }}>
          Update this information
          </Link>
          <small className="text-muted"> (Last updated <Timestamp {...result} />)</small>
        </div>
      </div>
    )
  ));
}

export default Result;
