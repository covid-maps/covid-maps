import ReactGA from "react-ga";

const category = "user_events";

const recordEvent = action => () => {
  ReactGA.event({ category, action });
};

export const recordUpdateStore = recordEvent("store_updated_started");
export const recordAddNewStore = recordEvent("add_new_store_started");
export const recordAddInfoToStoreCard = recordEvent(
  "add_info_store_card_started"
);
export const recordFormSubmission = recordEvent("form_submitted");
export const recordAddToHomescreen = recordEvent("add_to_homescreen_started");
export const recordDirectionsClicked = recordEvent("directions_clicked");
export const recordStoreFilterKeypress = recordEvent(
  "store_filter_key_pressed"
);
export const recordStoreShareClicked = recordEvent("store_share_clicked");
export const recordAppShareClicked = recordEvent("app_share_clicked");
export const recordPwaLaunched = recordEvent("pwa_launched");

export const recordSearchCompleted = queryTypes => {
  queryTypes.forEach(type => {
    ReactGA.event({
      category,
      action: "search_completed",
      label: type,
    });
  });
};

export const recordLanguageSelection = selectedLanguage => {
  ReactGA.event({
    category,
    action: `language_selected_${selectedLanguage.toLowerCase()}`,
  });
};

export const recordCustomTagAdded = tagName => {
  ReactGA.event({
    category,
    action: "custom_tag_added",
    label: tagName,
  });
};

export const recordNewVote = voteType => {
  ReactGA.event({
    category,
    action: "new_vote_added",
    label: voteType,
  });
};

export const recordVoteUnselection = voteType => {
  ReactGA.event({
    category,
    action: "vote_unselected",
    label: voteType,
  });
};
