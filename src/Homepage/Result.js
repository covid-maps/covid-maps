import React from "react";

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

function ResultEntry({ entries }) {
  const resultList = entries.filter(
    result => result["Useful Information"] || result["Safety Observations"]
  );
  return resultList.map(result => (
    <div className="mt-3" key={result["Timestamp"]}>
      <div>
        {result["Safety Observations"] ? (
          <div>{result["Safety Observations"]}</div>
        ) : null}
        {result["Useful Information"] ? (
          <div>{result["Useful Information"]}</div>
        ) : null}
      </div>
      <div className="card-link" style={{ fontSize: "0.8em" }}>
        <small className="text-muted text-uppercase d-inline-block mt-2">
          {" "}
          Updated <Timestamp {...result} />
        </small>
      </div>
    </div>
  ));
}

export default ResultEntry;
