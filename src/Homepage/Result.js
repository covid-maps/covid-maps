import React from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

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

function ResultEntry({ entries }) {
  const resultList = entries
    .filter(
      result => result["Useful Information"] || result["Safety Observations"]
    )
    .filter(result => isPresentable(result));
  return resultList.map(result => (
    <div className="mt-3" key={result["Timestamp"]}>
      <div className="d-inline-block">
        {result["Safety Observations"] ? (
          <div className="d-inline-block">
            <Overlay text="Safety instructions and tips">
              <div>
                <i className="far fa-shield-virus mr-1"></i>
                {result["Safety Observations"]}
              </div>
            </Overlay>
          </div>
        ) : null}
        {result["Useful Information"] ? (
          <div className="d-block mt-1">
            <Overlay text="Useful information from the visit">
              <div>
                <i className="far fa-info-circle mr-1"></i>
                {result["Useful Information"]}
              </div>
            </Overlay>
          </div>
        ) : null}
      </div>
      <div style={{ fontSize: "0.85em" }}>
        <small className="text-muted text-uppercase d-inline-block mt-1">
          Updated <Timestamp {...result} />
        </small>
      </div>
    </div>
  ));
}

export default ResultEntry;
