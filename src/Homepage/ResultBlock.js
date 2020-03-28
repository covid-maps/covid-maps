import React from "react";
import { Link } from "react-router-dom";
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

function ResultBlock(props) {
  return (
    <div className="my-3">
      <h5>{props["Store Name"]}</h5>
      <h6>{props["Manual Address"]}</h6>
      <div>
        <span>{props["Useful Information"]}</span> <Timestamp {...props} />
      </div>
      <div>
        <span>
          <Link to={{ pathname: "/submit", state: { item: props } }}>
            Share your experience
          </Link>
        </span>
      </div>
    </div>
  );
}

export default ResultBlock;
