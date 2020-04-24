import React from "react";
import EntriesGroup from "./EntriesGroup";
import { Link } from "react-router-dom";
import {
  recordUpdateStore,
  recordDirectionsClicked,
  recordStoreShareClicked,
} from "../gaEvents";
import Highlighter from "react-highlight-words";
import { withGlobalContext } from "../App";
import { FORM_FIELDS } from "../constants";
import { shareApiIsAvailable } from "../utils";

function constructDirectionsUrl({ name, placeId, lat, lng }) {
  if (placeId) {
    return `https://www.google.com/maps/search/?api=1&query=${name}&query_place_id=${placeId}`;
  } else {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }
}

function prepareStoreForUpdate(entry) {
  return {
    ...entry,
    [FORM_FIELDS.SAFETY_OBSERVATIONS]: "",
    [FORM_FIELDS.USEFUL_INFORMATION]: "",
    [FORM_FIELDS.OPENING_TIME]: "",
    [FORM_FIELDS.CLOSING_TIME]: "",
    [FORM_FIELDS.AVAILABILITY_TAGS]: [],
    [FORM_FIELDS.SAFETY_CHECKS]: [],
  };
}

function shareListing(event, store) {
  event.stopPropagation();
  recordStoreShareClicked();
  let storeName = store.name;
  let storeId = store.entries[0].StoreId;
  let url = `${window.location.origin}/store/${storeId}`;
  if (navigator.share) {
    navigator.share({
      title: `${storeName}`,
      text: `Check out the latest information on ${storeName} using Covid Maps — crowdsourced updates on essential services during lockdown period.\n`,
      url: url,
    });
  }
}

function onDirectionButtonClick(event) {
  event.stopPropagation();
  recordDirectionsClicked();
}

function ResultBlock(props) {
  const onClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    props.onClick && props.onClick(props.result);
  };

  const { result } = props;
  const entry = result.entries.length ? result.entries[0] : undefined;
  const showShareButton = shareApiIsAvailable();

  return (
    <div
      onClick={() => onClick()}
      className={`card mb-4 card-result-block border-0 shadow ${
        props.isSelected ? "card-result-block-selected" : ""
      }`}
    >
      <div className="card-body p-0">
        <div className="p-3">
          <h5 className="card-title m-0 p-0 d-inline-block">
            <Highlighter
              highlightClassName="highlighted-text"
              searchWords={[props.highlightedText]}
              autoEscape={true}
              textToHighlight={result.name}
            />
          </h5>
          <EntriesGroup
            highlightedText={props.highlightedText}
            entries={result.entries}
            translations={props.translations}
          />
        </div>
        <div className="d-flex align-items-center justify-content-between">
          <Link
            to={{
              pathname: "/update",
              state: { item: prepareStoreForUpdate(entry) },
            }}
            className="btn btn-link text-success text-sm rounded-0 border-top border-right flex-grow-1"
            onClick={recordUpdateStore}
          >
            {props.translations.add_update}
          </Link>
          <a
            href={constructDirectionsUrl(result)}
            onClick={e => onDirectionButtonClick(e)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-link text-success text-sm rounded-0 border-top border-right flex-grow-1"
          >
            Open in Maps
          </a>
          {showShareButton && (
            <div
              onClick={e => shareListing(e, result)}
              className="btn btn-link text-success text-sm rounded-0 border-top flex-grow-1"
            >
              <i className="far fa-share-alt mr-2" /> <span>Share</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default withGlobalContext(ResultBlock);
