import React, { useState, useEffect } from "react";
import ResultEntry from "./Result";
import { Link } from "react-router-dom";
import { recordUpdateStore, recordDirectionsClicked, recordStoreShareClicked } from "../gaEvents";
import Highlighter from "react-highlight-words";
import { withGlobalContext } from "../App";
import { STORE_CATEGORIES, FORM_FIELDS } from '../constants';

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
    [FORM_FIELDS.STORE_CATEGORY]:
      entry[FORM_FIELDS.STORE_CATEGORY] && entry[FORM_FIELDS.STORE_CATEGORY].length
        ? entry[FORM_FIELDS.STORE_CATEGORY][0]
        : STORE_CATEGORIES.GROCERY,
  };
}

function shareListing(event, store) {
  event.stopPropagation();
  recordStoreShareClicked();
  let storeName = store.name
  let storeId = store.entries[0].StoreId
  let url = `${window.location.origin}/store/${storeId}`
  if (navigator.share) {
    navigator.share({
      title: `${storeName}`,
      text: `Check out the latest information on ${storeName} using Covid Maps — crowdsourced updates on essential services during lockdown period.\n`,
      url: url
    })
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
  }

  const { result } = props;
  const [showShareButton, setShareButtonState] = useState(false)
  const entry = result.entries.length ? result.entries[0] : undefined;
  useEffect(() => {
    if (navigator.share) {
      setShareButtonState(true)
    }
  }, [])
  return (
    <div
      onClick={() => onClick()}
      className={`card my-1 card-result-block ${
        props.isSelected ? "card-result-block-selected" : ""
        }`}
    >
      <div className="card-body p-3">
        <div className='d-flex justify-content-between align-center-items'>
          <h5 className="card-title m-0 p-0 d-inline-block">
            <Highlighter
              highlightClassName="highlighted-text"
              searchWords={[props.highlightedText]}
              autoEscape={true}
              textToHighlight={result.name}
            />
          </h5>
          <div style={{ minWidth: 160, textAlign: 'right' }}>
            {
              showShareButton &&
              <div
                onClick={(e) => shareListing(e, result)}
                className="btn btn-sm btn-outline-secondary text-uppercase mr-2"
              >
                <i className="far fa-share-alt"></i>
              </div>
            }
            <Link
              to={{
                pathname: "/update",
                state: { item: prepareStoreForUpdate(entry) },
              }}
              className="btn btn-sm btn-outline-success text-uppercase"
              onClick={recordUpdateStore}
            >
              {props.translations.update}
            </Link>
            <a
              href={constructDirectionsUrl(result)}
              onClick={(e) => onDirectionButtonClick(e)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-outline-secondary text-uppercase ml-2"
            >
              <i className="far fa-directions"></i>
            </a>
          </div>
        </div>
        <ResultEntry
          highlightedText={props.highlightedText}
          entries={result.entries}
        />
      </div>
    </div>
  );
}

export default withGlobalContext(ResultBlock);