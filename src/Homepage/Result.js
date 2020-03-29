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

function Result(storeResults) {
  const resultList = []
  for (const key in storeResults) {
    if (storeResults[key]["Useful Information"])
      {
        resultList.push(storeResults[key]);
      }
  }
  return (
    _.sortBy(resultList, 'Timestamp').map(result => (
      <div className="my-3">
        <div>
          <span>{result["Useful Information"]}</span> <Timestamp {...result} />
        </div>
        <div>
          <span>
            <Link to={{ pathname: "/submit", state: { item: result } }}>
            Update this information
            </Link>
          </span>
        </div>
      </div>
    )
  ));
}

export default Result;
