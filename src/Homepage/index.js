import React from "react";
import qs from "qs";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import PropTypes from "prop-types";
import SearchResults from "./SearchResults";
import MissingBlock from "./MissingBlock";
import * as api from "../api";
import { getDistance } from "geolib";
import HomepageMapWithSearch from "../MapsWithSearch/HomepageMap";
import { isStoreType, getFirstComma, titleCase, spacesAfterCommas } from "../utils";
import { recordAddNewStore, recordStoreFilterKeypress } from "../gaEvents";
import Form from "react-bootstrap/Form";
import { withGlobalContext } from "../App";
import HomepageAlerts from "./HomepageAlerts";
import { FORM_FIELDS, ALERTS_TYPE } from "../constants";
import { withSessionStorage } from "../withStorage";

const DISTANCE_FILTER = 200000; // meters
const SHOW_MISSING_KEY = "showMissing";

function searchResultToFormEntry(searchResult) {
  if (!searchResult) return undefined;
  return {
    "Store Name": getFirstComma(searchResult.name),
    Latitude: searchResult.latLng.lat,
    Longitude: searchResult.latLng.lng,
    "Place Id": searchResult.place_id,
    City: searchResult.city,
    Locality: searchResult.locality,
    Address: searchResult.address,
    Country: searchResult.country,
  };
}

class Homepage extends React.Component {
  static propTypes = {
    translations: PropTypes.object.isRequired,
    currentLocation: PropTypes.object,
    setCurrentLocation: PropTypes.func.isRequired,
    getItemFromStorage: PropTypes.func.isRequired,
    setItemToStorage: PropTypes.func.isRequired,

    // coming from react router
    location: PropTypes.shape({
      search: PropTypes.string.isRequired,
    }).isRequired,
    history: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.object.isRequired,
    }).isRequired,
  };

  state = {
    storeFilterQuery: "",
    results: [],
    markers: [],
    isLoading: true,
    mapShouldPan: false,
    selectedLocation: undefined,
    searchResultLatlng: undefined,
    searchResult: undefined,
    alertType: "",
    showAlert: true,
    showMissing: false,
    usePrevShowMissing: true,
  };

  toggleAlert = () => {
    this.setState(prevState => {
      return { showAlert: !prevState.showAlert };
    });
  };

  hideMissing = () => {
    this.props.setItemToStorage(SHOW_MISSING_KEY, false);
    this.setState(() => {
      return { showMissing: false };
    });
  };

  updateShowMissing = () => {
    let showMissing = true;
    if (this.state.usePrevShowMissing) {
      let prevMissing = JSON.parse(this.props.getItemFromStorage(SHOW_MISSING_KEY));
      showMissing = prevMissing === null || prevMissing === true;
    }
    this.props.setItemToStorage(SHOW_MISSING_KEY, showMissing);

    this.setState({
      showMissing: showMissing,
      usePrevShowMissing: false,
    })
  }

  async fetchResults() {
    let locationComingFromSubmission;
    let selectedStoreName;
    const queryParams = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true,
    });
    if ("submittedStore" in queryParams) {
      const storeData = JSON.parse(atob(queryParams.submittedStore));
      locationComingFromSubmission = { lat: storeData.Latitude, lng: storeData.Longitude };
      selectedStoreName = storeData[FORM_FIELDS.STORE_NAME];
    }

    let queryLocation = locationComingFromSubmission
      || this.state.searchResultLatlng
      || this.props.currentLocation.latLng;
    const response = await api.query({
      ...queryLocation,
      radius: DISTANCE_FILTER,
    });
    const { results: data, location: locationComingFromServer } = response;
    if (!queryLocation) {
      this.props.setCurrentLocation({
        latLng: locationComingFromServer, accuracy: 'low'
      });
    }

    const isLocationSelected = Boolean(locationComingFromSubmission);
    const newCenter = locationComingFromSubmission || locationComingFromServer;

    this.setState(
      {
        results: this.formatResults(data, newCenter),
        markers: data.map(result => ({
          lat: Number(result.Latitude),
          lng: Number(result.Longitude),
        })),
        isLoading: false,
        selectedLocation: locationComingFromSubmission,
        selectedStoreName,
        searchResultLatlng: newCenter,
        mapShouldPan: isLocationSelected,
        alertType: isLocationSelected
          ? ALERTS_TYPE.FORM_SUBMIT_SUCESS
          : ALERTS_TYPE.WEBSITE_PURPOSE,
      },
      () => {
        if (isLocationSelected) {
          // remove query param from url
          this.props.history.replace("/");

          setTimeout(() => this.setState({ mapShouldPan: false }), 1000);

          const searchResultsContainer = document.querySelector(
            ".search-results-container"
          );
          if (searchResultsContainer && searchResultsContainer.scrollIntoView) {
            searchResultsContainer.scrollIntoView();
            // approx height of success alert is 120
            // we will move the store card just below this alert
            window.scrollBy(0, -120);
          }
        }
      }
    );
  }

  async componentDidMount() {
    const params = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
    let currentLocation = undefined;

    if (params.currentLocation) {
      try {
        const [lat, lng] = params.currentLocation.split(',').map(parseFloat);
        const currentLatLng = { lat, lng };
        const accuracy = params.accuracy === 'high' || params.accuracy === 'low' ?
          params.accuracy : 'low';
        currentLocation = { latLng: currentLatLng, accuracy };
      } catch (e) {
        console.log('Cannot parse les query params.')
      }
    }

    if (currentLocation) {
      await this.props.setCurrentLocation(currentLocation);
    }
    try {
      await this.fetchResults();
      this.goToStoreFromProps();
    } catch (e) {
      console.log("Fetch results failed :(")
    }
  }

  async goToStoreFromProps() {
    if (this.props.match.params.storeId) {
      const storeId = parseInt(this.props.match.params.storeId);
      const response = await api.queryByStoreId({
        storeId,
        radius: DISTANCE_FILTER
      })

      const { results: data, location: locationComingFromServer } = response;
      this.setState({ results: this.formatResults(data, locationComingFromServer), })

      const place = this.state.results.find(item => item.storeId === storeId);
      if (place) {
        this.onCardClick(place);
        const latLng = {
          lat: place.lat,
          lng: place.lng,
        };
        this.setState({
          center: { latLng: latLng },
          results: this.calculateGroupDistance(this.state.results, latLng),
        });
      }
    }
  }

  calculateDistance(result, center) {
    if (!result || !center || !center.lat || !center.lng) {
      return Number.MAX_SAFE_INTEGER;
    }
    return getDistance(
      { latitude: result.lat, longitude: result.lng },
      { latitude: center.lat, longitude: center.lng }
    );
  }

  calculateGroupDistance(grouped, center) {
    const groupedResult = grouped.map(group => ({
      ...group,
      distance: this.calculateDistance(group, center),
    }));
    return groupedResult.sort((a, b) => a.distance - b.distance);
  }

  formatResults(results, centerLocation) {
    const grouped = Object.values(
      results.reduce((obj, result) => {
        if (!obj.hasOwnProperty(result["Place Id"] || result["Store Name"])) {
          obj[result["Place Id"] || result["Store Name"]] = [];
        }
        obj[result["Place Id"] || result["Store Name"]].push(result);
        return obj;
      }, {})
    ).map(entries => {
      const sortedEntries = entries
        .sort((a, b) => b.Timestamp - a.Timestamp)
        .reverse();
      return {
        name: spacesAfterCommas(titleCase(entries[0]["Store Name"])),
        placeId: entries[0]["Place Id"],
        storeId: entries[0]["StoreId"],
        lat: Number(entries[0].Latitude),
        lng: Number(entries[0].Longitude),
        entries: sortedEntries,
      };
    });
    return this.calculateGroupDistance(grouped, centerLocation);
  }

  isMissingLocationInformation(location) {
    return (
      location &&
      isStoreType(location.types) &&
      location.name &&
      !this.state.results.find(result => result.placeId === location.place_id)
    );
  }

  onCardClick(card) {
    this.setState({
      selectedLocation: { lat: Number(card.lat), lng: Number(card.lng) },
      mapShouldPan: true,
      selectedStoreName: card.name,
    });
    setTimeout(() => this.setState({ mapShouldPan: false }), 1000);
  }

  onMarkerSelected(latLng) {
    const result = this.state.results.find(({ lat, lng }) => {
      return lat === latLng.lat && lng === latLng.lng;
    });
    const storeName = result ? result.name : undefined;
    this.setState({
      selectedLocation: { ...latLng },
      selectedStoreName: storeName,
      mapShouldPan: false,
    });
  }

  getLinkState() {
    const item = searchResultToFormEntry(this.state.searchResult);
    return item
      ? { item: searchResultToFormEntry(this.state.searchResult) }
      : undefined;
  }

  getLinkTo() {
    const state = this.getLinkState();
    return state && state["Store Name"]
      ? { pathname: "/update", state }
      : { pathname: "/location" };
  }

  handleStoreFilterQuery = event => {
    recordStoreFilterKeypress();
    this.setState({
      storeFilterQuery: event.target.value,
      selectedLocation: undefined,
    });
  };

  onGeolocationFound = () => {
    // Clear search result and refresh distances
    this.setState(
      {
        searchResult: undefined,
        searchResultLatlng: undefined,
        isLoading: true,
      },
      () => {
        this.fetchResults();
      }
    );
  };

  onSearchCompleted = result => {
    if (result && result.latLng) {
      this.setState(
        {
          searchResultLatlng: result.latLng,
          searchResult: result,
          isLoading: true,
          showMissing: false,
        },
        () => {
          this.fetchResults();
          setTimeout(this.updateShowMissing, 500);
        }
      );
    }
  };

  render() {
    let missingBlock = null;
    let selectedForMissing = undefined;
    if (this.isMissingLocationInformation(this.state.searchResult)) {
      const { searchResult, searchResultLatlng } = this.state;
      missingBlock = (
        <MissingBlock
          missing={true}
          result={{
            name: searchResult.name,
            entries: [searchResultToFormEntry(searchResult)],
          }}
          showMissing={this.state.showMissing}
          onClose={this.hideMissing}
        ></MissingBlock>
      );
      selectedForMissing = searchResultLatlng;
    }
    const markers = this.state.results.map(res => ({
      lat: Number(res.lat),
      lng: Number(res.lng),
    }));
    const { translations } = this.props;
    return (
      <div>
        <HomepageAlerts
          {...this.props}
          showAlert={this.state.showAlert}
          alertType={this.state.alertType}
          toggleAlert={this.toggleAlert}
        />
        <HomepageMapWithSearch
          value=""
          onSearchSuccess={this.onSearchCompleted}
          onGeolocationFound={this.onGeolocationFound}
          selectedLocation={selectedForMissing || this.state.selectedLocation}
          style={{ height: "45vh" }}
          currentLocation={this.props.currentLocation}
          centerPosition={
            this.state.searchResultLatlng ||
            this.props.currentLocation.latLng
          }
          locations={
            selectedForMissing
              ? [...markers, this.state.searchResultLatlng]
              : markers
          }
          onMarkerSelected={latLng => this.onMarkerSelected(latLng)}
          panToLocation={this.state.mapShouldPan && this.state.selectedLocation}
        />
        <div className="mx-2">
          {missingBlock}
          <div className="my-4 d-flex justify-content-between align-items-center">
            <div>
              <h6 className="m-0 mr-2 font-weight-bold search-results-title d-inline-block">
                {translations.store_nearby_label}
              </h6>
              <Form.Control
                type="text"
                onChange={this.handleStoreFilterQuery}
                className="d-inline-block results-search-box"
                value={this.state.storeFilterQuery}
                placeholder={translations.store_search_placeholder}
              />
            </div>
            <div>
              <Link to={this.getLinkTo()}>
                <Button
                  size="sm"
                  variant="outline-success"
                  className="text-uppercase"
                  onClick={recordAddNewStore}
                >
                  {translations.add_store}
                </Button>
              </Link>
            </div>
          </div>
          <SearchResults
            selectedStoreName={this.state.selectedStoreName}
            textFilter={this.state.storeFilterQuery}
            onCardClick={card => this.onCardClick(card)}
            isLoading={this.state.isLoading}
            selectedLocation={this.state.selectedLocation}
            results={this.state.results}
            loadMoreBtnText={this.props.translations.load_more}
          />
        </div>
      </div>
    );
  }
}

export default withSessionStorage(withGlobalContext(Homepage));