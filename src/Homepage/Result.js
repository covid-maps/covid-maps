import React from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Highlighter from "react-highlight-words";

const humanizeDuration = require("humanize-duration");

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

function Updated({ Timestamp: value }) {
  const updated = new Date(value);
  return (
    <strong>
      {updated.toLocaleDateString()} {updated.toLocaleTimeString()}
    </strong>
  );
}

function ResultEntry({ entries, highlightedText }) {
  return entries.map(result => (
    <div className="mt-3" key={result["Timestamp"]}>
      <div>
        {result["Safety Observations"] ? (
          <div>
            <Overlay text="Safety Observations">
              <i className="far fa-shield-virus"></i>
            </Overlay>{" "}
            <Highlighter
              highlightClassName="highlighted-text"
              searchWords={[highlightedText]}
              autoEscape={true}
              textToHighlight={result["Safety Observations"]}
            />
          </div>
        ) : null}
        {result["Useful Information"] ? (
          <div>
            <Overlay text="Useful Information">
              <i className="far fa-info-circle"></i>
            </Overlay>{" "}
            <Highlighter
              highlightClassName="highlighted-text"
              searchWords={[highlightedText]}
              autoEscape={true}
              textToHighlight={result["Useful Information"]}
            />
          </div>
        ) : null}
        {result["Opening Time"] || result["Closing Time"] ? (
          <div>
            <Overlay text="Store timings">
              <i className="far fa-clock"></i>
            </Overlay>{" "}
            {result["Opening Time"]
              ? `Opens at ${result["Opening Time"]}. `
              : null}
            {result["Closing Time"]
              ? `Closes at ${result["Closing Time"]}. `
              : null}
          </div>
        ) : null}
      </div>
      <div style={{ fontSize: "0.85em" }}>
        <small className="text-muted text-uppercase d-inline-block mt-2">
          {" "}
          Updated <Timestamp {...result} /> at <Updated {...result} />
        </small>
      </div>
    </div>
  ));
}

export default ResultEntry;
