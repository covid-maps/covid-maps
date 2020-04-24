import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Button from "react-bootstrap/Button";
import Highlighter from "react-highlight-words";
import { FORM_FIELDS } from "../constants";
import { format, differenceInCalendarDays } from "date-fns";
import { Collapse } from "@material-ui/core";
import { ReadOnlyTags } from "../SubmitPage/AvailabilityTags";

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
  const dayDifference = differenceInCalendarDays(now, then);

  let time = format(then, "h':'mm a");

  if (dayDifference === 1) {
    let dayOfWeek = format(then, "EEE");
    time += ", " + dayOfWeek + " (1 day ago)";
  } else if (dayDifference > 1) {
    let dayOfWeek = format(then, "EEE");
    time += ", " + dayOfWeek + " (" + dayDifference + " days ago)";
  }

  return <strong>{time}</strong>;
}

const SingleEntry = ({ entry, highlightedText, translations }) => {
  return (
    <div className="mt-3">
      <div>
        {entry[FORM_FIELDS.AVAILABILITY_TAGS] ? (
          <ReadOnlyTags
            labels={entry[FORM_FIELDS.AVAILABILITY_TAGS]}
            translations={translations}
          />
        ) : null}

        {entry[FORM_FIELDS.SAFETY_CHECKS] && (
          <ul className="list-unstyled my-3">
            {entry[FORM_FIELDS.SAFETY_CHECKS].map(check => {
              return (
                <li key={check} className="d-flex align-items-center mb-2">
                  <i className="far fa-check text-success mr-2"></i>
                  <div>{translations[`safety_check__${check}`]}</div>
                </li>
              );
            })}
          </ul>
        )}

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
      <small className="text-muted d-block mt-2">
        Updated <Timestamp {...entry} />
      </small>
      <div className="d-flex align-items-center mt-2">
        <span className="mr-3">Is this information correct?</span>
        <Button
          variant="outline-secondary"
          size="sm"
          className="mr-2 rounded-pill text-xs"
        >
          <span className="mr-2">Yes</span>
          <span role="img" aria-label="thumbs up">
            👍
          </span>
        </Button>
        <Button
          variant="outline-secondary"
          size="sm"
          className="mr-2 rounded-pill text-xs"
        >
          <span className="mr-2">No</span>
          <span role="img" aria-label="thumbs down">
            👎
          </span>
        </Button>
      </div>
    </div>
  );
};

SingleEntry.propTypes = {
  entry: PropTypes.object.isRequired,
  highlightedText: PropTypes.string,
  translations: PropTypes.object.isRequired,
};

class EntriesGroup extends Component {
  static propTypes = {
    entries: PropTypes.arrayOf(PropTypes.object).isRequired,
    highlightedText: PropTypes.string,
    translations: PropTypes.object.isRequired,
  };

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
        translations={this.props.translations}
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
        <span>{`${this.props.translations.view_old_updates} (${
          this.props.entries.length - 1
        })`}</span>
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
          translations={this.props.translations}
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
        <Collapse in={this.state.showPastEntries}>
          {this.getPastEntries(pastEntries)}
        </Collapse>
      </Fragment>
    );
  }
}

export default EntriesGroup;
