import React from "react";
import { Link } from "react-router-dom";

function ResultBlock(props) {
  return (
    <div className="my-3">
      <h5>{props["Store Name"]}</h5>
      <h6>{props["Manual Address"]}</h6>
      <div>
        <span>{props["Useful Information"]}</span>{" "}
        <strong>{props["Timestamp"]}</strong>
      </div>
      <div>
        <span>
          <Link to="/submit">Share your experience</Link>
        </span>
      </div>
    </div>
  );
}

export default ResultBlock;
