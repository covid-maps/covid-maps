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
  console.log(storeResults)
  return (
    Object.keys(storeResults).map(resultIndex => (
      <div className="my-3">
        <div>
          <span>{storeResults[resultIndex]["Useful Information"]}</span> <Timestamp {...storeResults[resultIndex]} />
        </div>
        <div>
          <span>
            <Link to={{ pathname: "/submit", state: { item: storeResults[resultIndex] } }}>
            Update this information
            </Link>
          </span>
        </div>
      </div>
    )
  ));
}

export default Result;
