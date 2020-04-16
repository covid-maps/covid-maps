import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Button from "react-bootstrap/Button";
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

const SingleEntry = ({ entry, highlightedText }) => {
  return (
    <div className="mt-3">
      <div>
        {entry[FORM_FIELDS.SAFETY_OBSERVATIONS] ? (
          <div>
            <Overlay text="Safety Observations">
              <i className="far fa-shield-virus"></i>
            </Overlay>{" "}
            <Highlighter
              highlightClassName="highlighted-text"
              searchWords={[highlightedText]}
              autoEscape={true}
              textToHighlight={entry[FORM_FIELDS.SAFETY_OBSERVATIONS]}
            />
          </div>
        ) : null}
        {entry[FORM_FIELDS.USEFUL_INFORMATION] ? (
          <div>
            <Overlay text="Useful Information">
              <i className="far fa-info-circle"></i>
            </Overlay>{" "}
            <Highlighter
              highlightClassName="highlighted-text"
              searchWords={[highlightedText]}
              autoEscape={true}
              textToHighlight={entry[FORM_FIELDS.USEFUL_INFORMATION]}
            />
          </div>
        ) : null}
        {entry[FORM_FIELDS.OPENING_TIME] || entry[FORM_FIELDS.CLOSING_TIME] ? (
          <div>
            <Overlay text="Store timings">
              <i className="far fa-clock"></i>
            </Overlay>{" "}
            {entry[FORM_FIELDS.OPENING_TIME]
              ? `Opens at ${entry[FORM_FIELDS.OPENING_TIME]}. `
              : null}
            {entry[FORM_FIELDS.CLOSING_TIME]
              ? `Closes at ${entry[FORM_FIELDS.CLOSING_TIME]}. `
              : null}
          </div>
        ) : null}
      </div>
      <div style={{ fontSize: "0.85em" }}>
        <small className="text-muted text-uppercase d-inline-block mt-2">
          {" "}
          Updated <Timestamp {...entry} />
        </small>
      </div>
    </div>
  );
};

SingleEntry.propTypes = {
  entry: PropTypes.object.isRequired,
  highlightedText: PropTypes.string,
}

class EntriesGroup extends Component {
  static propTypes = {
    entries: PropTypes.arrayOf(PropTypes.object).isRequired,
    highlightedText: PropTypes.string,
    translations: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      showPastEntries: false,
    };

    // not advisable to have an arrow function
    // when a component has multiple instances
    // creates multiple clones of same function and increase heap
    this.togglePastEntries = this.togglePastEntries.bind(this);
    this.getPastEntries = this.getPastEntries.bind(this);
    this.getToggleButtonContent = this.getToggleButtonContent.bind(this);
  }

  togglePastEntries(event) {
    event.stopPropagation();
    this.setState(prevState => {
      return {
        showPastEntries: !prevState.showPastEntries,
      };
    });
  }

  getPastEntries(entryList) {
    return entryList.map(entry => (
      <SingleEntry
        key={entry[FORM_FIELDS.TIMESTAMP]}
        entry={entry}
        highlightedText={this.props.highlightedText}
      />
    ));
  }

  getToggleButtonContent() {
    return this.state.showPastEntries ? (
      <Fragment>
        <span>{this.props.translations.hide_old_updates}</span>
        <i className="fas fa-chevron-down ml-1"></i>
      </Fragment>
    ) : (
      <Fragment>
        <span>{`${this.props.translations.view_old_updates} (${this.props.entries.length - 1})`}</span>
        <i className="fas fa-chevron-right ml-1"></i>
      </Fragment>
    );
  }

  render() {
    const [firstEntry, ...pastEntries] = this.props.entries;
    const thereAreMoreThanOneEntries = pastEntries.length > 0;
    return (
      <Fragment>
        <SingleEntry
          entry={firstEntry}
          highlightedText={this.props.highlightedText}
        />
        {thereAreMoreThanOneEntries && (
          <Button
            variant="link"
            size="sm"
            className="p-0 mt-2 text-decoration-none toggle-past-entries"
            onClick={this.togglePastEntries}
          >
            {this.getToggleButtonContent()}
          </Button>
        )}
        {this.state.showPastEntries && this.getPastEntries(pastEntries)}
      </Fragment>
    );
  }
}

export default EntriesGroup;
