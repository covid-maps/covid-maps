import React from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const humanizeDuration = require("humanize-duration");

function isPresentable(entry) {
  return (
    entry["Safety Observations"].length > 5 ||
    entry["Useful Information"].length > 5
  );
}

function Overlay(props) {
  return (
    <OverlayTrigger
      key="top"
      placement="top"
      overlay={<Tooltip id="tooltip-top">{props.text}</Tooltip>}
    >
      {props.children}
    </OverlayTrigger>
  );
}

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
  const resultList = entries.filter(isPresentable);
  return resultList.map(result => (
    <div className="mt-3" key={result["Timestamp"]}>
      <div>
        {result["Safety Observations"] ? (
          <div>
            <Overlay text="Safety Observations">
              <i className="far fa-shield-virus"></i>
            </Overlay>{" "}
            {result["Safety Observations"]}
          </div>
        ) : null}
        {result["Useful Information"] ? (
          <div>
            <Overlay text="Useful Information">
              <i className="far fa-info-circle"></i>
            </Overlay>{" "}
            {result["Useful Information"]}
          </div>
        ) : null}
      </div>
      <div style={{ fontSize: "0.85em" }}>
        <small className="text-muted text-uppercase d-inline-block mt-2">
          {" "}
          Updated <Timestamp {...result} />
        </small>
      </div>
    </div>
  ));
}

export default ResultEntry;
