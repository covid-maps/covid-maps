import React from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Highlighter from "react-highlight-words";
import { FORM_FIELDS } from "../constants";

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

function ResultEntry({ entries, highlightedText }) {
  return entries.map(result => (
    <div className="mt-3" key={result[FORM_FIELDS.TIMESTAMP]}>
      <div>
        {result[FORM_FIELDS.SAFETY_OBSERVATIONS] ? (
          <div>
            <Overlay text="Safety Observations">
              <i className="far fa-shield-virus"></i>
            </Overlay>{" "}
            <Highlighter
              highlightClassName="highlighted-text"
              searchWords={[highlightedText]}
              autoEscape={true}
              textToHighlight={result[FORM_FIELDS.SAFETY_OBSERVATIONS]}
            />
          </div>
        ) : null}
        {result[FORM_FIELDS.USEFUL_INFORMATION] ? (
          <div>
            <Overlay text="Useful Information">
              <i className="far fa-info-circle"></i>
            </Overlay>{" "}
            <Highlighter
              highlightClassName="highlighted-text"
              searchWords={[highlightedText]}
              autoEscape={true}
              textToHighlight={result[FORM_FIELDS.USEFUL_INFORMATION]}
            />
          </div>
        ) : null}
        {result[FORM_FIELDS.OPENING_TIME] ||
        result[FORM_FIELDS.CLOSING_TIME] ? (
          <div>
            <Overlay text="Store timings">
              <i className="far fa-clock"></i>
            </Overlay>{" "}
            {result[FORM_FIELDS.OPENING_TIME]
              ? `Opens at ${result[FORM_FIELDS.OPENING_TIME]}. `
              : null}
            {result[FORM_FIELDS.CLOSING_TIME]
              ? `Closes at ${result[FORM_FIELDS.CLOSING_TIME]}. `
              : null}
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
