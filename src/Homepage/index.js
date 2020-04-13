import React from "react";
import qs from "qs";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import PropTypes from "prop-types";
import Alert from "react-bootstrap/Alert";
import SearchResults from "./SearchResults";
import MissingBlock from "./MissingBlock";
import * as api from "../api";
import { getDistance } from "geolib";
import HomepageMapWithSearch from "../MapsWithSearch/HomepageMap";
import { isStoreType, getFirstComma } from "../utils";
import { recordAddNewStore, recordStoreFilterKeypress } from "../gaEvents";
import Form from "react-bootstrap/Form";
import ShareButton from "../ShareButton";
import { withGlobalContext } from "../App";
import { FORM_FIELDS, ALERTS_TYPE } from "../constants";

const DISTANCE_FILTER = 200000; // meters

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
    ipLocation: PropTypes.object,
    geoLocation: PropTypes.object,
    setIPlocation: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired, // coming from react router
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
  };

  toggleAlert = () => {
    this.setState(prevState => {
      return { showAlert: !prevState.showAlert };
    });
  };

  async fetchResults() {
    let queryLocation = this.state.searchResultLatlng;
    const response = await api.query({
      ...queryLocation,
      radius: DISTANCE_FILTER,
    });
    const { results: data, location: locationComingFromServer } = response;
    if (!queryLocation) {
      this.props.setIPlocation(locationComingFromServer);
    }

    let selectedLocation;
    let selectedStoreName;

    const queryParams = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true,
    });
    if ("submittedStore" in queryParams) {
      const storeData = JSON.parse(atob(queryParams.submittedStore));
      selectedLocation = { lat: storeData.Latitude, lng: storeData.Longitude };
      selectedStoreName = storeData[FORM_FIELDS.STORE_NAME];
    }

    const isLocationSelected = Boolean(selectedLocation);

    this.setState(
      {
        results: this.formatResults(
          data,
          selectedLocation || locationComingFromServer
        ),
        markers: data.map(result => ({
          lat: Number(result.Latitude),
          lng: Number(result.Longitude),
        })),
        isLoading: false,
        selectedLocation,
        selectedStoreName,
        searchResultLatlng: selectedLocation,
        mapShouldPan: isLocationSelected,
        alertType: isLocationSelected
          ? ALERTS_TYPE.FORM_SUBMIT_SUCESS
          : ALERTS_TYPE.FORM_SUBMIT_SUCESS,
      },
      () => {
        // remove query param from url
        this.props.history.replace("/");

        if (selectedLocation) {
          setTimeout(() => this.setState({ mapShouldPan: false }), 1000);
        }
      }
    );
  }

  componentDidMount() {
    this.fetchResults().then(() => {
      this.goToStoreFromProps();
    });
  }

  goToStoreFromProps() {
    if (this.props.match.params.storeId) {
      const storeId = parseInt(this.props.match.params.storeId);
      const place = this.state.results.find(item => item.storeId === storeId);
      // console.log(place)
      //Run the function only if place is real value ( not nul || undefined)
      //Reuse the onCardClick function.
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
        name: entries[0]["Store Name"],
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
    this.setState({
      selectedLocation: { ...latLng },
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
        },
        () => {
          this.fetchResults();
        }
      );
    }
  };

  getAlertContent = () => {
    const { translations } = this.props;
    switch (this.state.alertType) {
      case ALERTS_TYPE.WEBSITE_PURPOSE:
        return (
          <Alert
            key="no-of-users"
            className="card no-of-users-alert"
            variant="primary"
            show={this.state.showAlert}
            onClose={this.toggleAlert}
            dismissible
          >
            {translations.website_purpose_banner}
          </Alert>
        );
      case ALERTS_TYPE.FORM_SUBMIT_SUCESS:
        return (
          <Alert
            className="mb-0"
            show={this.state.showAlert}
            key="form-submit-success"
            variant="success"
            onClose={this.toggleAlert}
            dismissible
          >
            {translations.form_submit_success}
            <ShareButton
              className="d-block mt-2"
              variant="success"
              size="sm"
              title="Covid Maps"
              url="https://covidmaps.in/"
              text={translations.website_share_description}
            >
              Share CovidMaps
            </ShareButton>
          </Alert>
        );
      default:
        return null;
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
        {this.getAlertContent()}
        <HomepageMapWithSearch
          value=""
          onSearchSuccess={this.onSearchCompleted}
          onGeolocationFound={this.onGeolocationFound}
          selectedLocation={selectedForMissing || this.state.selectedLocation}
          style={{ height: "45vh" }}
          currentLocation={this.props.geoLocation || this.props.ipLocation}
          centerPosition={
            this.state.searchResultLatlng ||
            this.props.geoLocation ||
            this.props.ipLocation
          }
          locations={
            selectedForMissing
              ? [...markers, this.state.searchResultLatlng]
              : markers
          }
          onMarkerSelected={latLng => this.onMarkerSelected(latLng)}
          panToLocation={this.state.mapShouldPan && this.state.selectedLocation}
        />
        <div className="my-3 mx-2">
          {missingBlock}
          <div className="my-1 px-1 d-flex justify-content-between align-items-center search-results-container">
            <div>
              <h6 className="text-uppercase m-0 font-weight-bold search-results-title d-inline-block">
                {translations.store_nearby_label}
              </h6>
              <Form.Control
                type="text"
                onChange={this.handleStoreFilterQuery}
                className="d-inline-block mx-1 results-search-box"
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

export default withGlobalContext(Homepage);
