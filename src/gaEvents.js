import ReactGA from "react-ga";

const category = "user_events";

export function recordSearchCompleted() {
  ReactGA.event({
    category,
    action: "search_completed"
  });
}

export function recordUpdateStore() {
  console.log("updated event");
  ReactGA.event({
    category,
    action: "store_updated_started"
  });
}

export function recordAddNewStore() {
  ReactGA.event({
    category,
    action: "add_new_store_started"
  });
}

export function recordAddInfoToStoreCard() {
  ReactGA.event({
    category,
    action: "add_info_store_card_started"
  });
}

export function recordFormSubmission() {
  ReactGA.event({
    category,
    action: "form_submitted"
  });
}
