import React from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import SearchResults from "./SearchResults";
import MissingBlock from "./MissingBlock";
import * as api from "../api";
import { getDistance } from "geolib";
import MapWithSearch from "../MapWithSearch";
import { isStoreType, getFirstComma } from "../utils";
import { recordAddNewStore } from "../gaEvents";

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
    Address: searchResult.address
  };
}

class Homepage extends React.Component {
  state = {
    results: [],
    markers: [],
    isLoading: true,
    center: {},
    searchResultLatlng: undefined,
    searchResult: undefined
  };

  componentDidMount() {
    api.query().then(data => {
      this.setState({
        results: this.formatResults(data),
        markers: data.map(result => ({
          lat: Number(result.Latitude),
          lng: Number(result.Longitude)
        })),
        isLoading: false
      });
    });
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

  calculateGroupDistance(grouped) {
    const groupedResult = grouped.map(group => ({
      ...group,
      distance: this.calculateDistance(group, this.state.center)
    }));
    return groupedResult.sort((a, b) => a.distance - b.distance);
  }

  formatResults(results) {
    const grouped = Object.values(
      results.reduce(function (obj, result) {
        if (!obj.hasOwnProperty(result["Place Id"] || result["Store Name"])) {
          obj[result["Place Id"] || result["Store Name"]] = [];
        }
        obj[result["Place Id"] || result["Store Name"]].push(result);
        return obj;
      }, {})
    ).map(entries => ({
      name: entries[0]["Store Name"],
      placeId: entries[0]["Place Id"],
      lat: entries[0].Latitude,
      lng: entries[0].Longitude,
      entries: entries.sort((a, b) => b.Timestamp - a.Timestamp).reverse()
    }));
    return this.calculateGroupDistance(grouped);
  }

  isMissingLocationInformation(location) {
    return (
      location &&
      isStoreType(location.types) &&
      location.name &&
      !this.state.results.find(result => result.placeId === location.place_id)
    );
  }

  onBoundsChanged(center) {
    this.setState({
      results: this.calculateGroupDistance(this.state.results),
      center: center
    });
  }

  onCardClick(card) {
    this.setState({
      center: { lat: Number(card.lat), lng: Number(card.lng) },
      results: this.calculateGroupDistance(this.state.results),
      searchResultLatlng: { lat: Number(card.lat), lng: Number(card.lng) }
    });
  }

  getLinkState() {
    const item = searchResultToFormEntry(this.state.searchResult);
    return item
      ? {
          item: searchResultToFormEntry(this.state.searchResult)
        }
      : undefined;
  }

  getLinkTo() {
    const state = this.getLinkState();
    return state && state["Store Name"]
      ? { pathname: "/update", state }
      : { pathname: "/location" };
  }

  render() {
    let missingBlock = null;
    if (this.isMissingLocationInformation(this.state.searchResult)) {
      const { searchResult } = this.state;
      missingBlock = (
        <MissingBlock
          missing={true}
          result={{
            name: searchResult.name,
            entries: [searchResultToFormEntry(searchResult)]
          }}
        ></MissingBlock>
      );
    }
    const closeByResults = this.state.results.filter(
      result => result.distance < DISTANCE_FILTER
    );
    return (
      <div>
        <MapWithSearch
          value=""
          onSuccess={result => {
            if (result && result.latLng) {
              this.setState(
                {
                  searchResultLatlng: result.latLng,
                  searchResult: result
                },
                this.onBoundsChanged(result.latLng)
              );
            }
          }}
          style={{ height: "45vh" }}
          position={this.state.searchResultLatlng}
          locations={this.state.markers}
          onBoundsChanged={center => this.onBoundsChanged(center)}
          onPositionChanged={position =>
            this.setState({
              searchResultLatlng: position,
              searchResult: null
            })
          }
        />
        <div className="my-3 mx-2">
          {missingBlock}
          <div className="my-1 px-3 d-flex justify-content-between align-items-center">
            <h6 className="text-uppercase m-0 font-weight-bold">
              Stores Nearby
            </h6>
            <Link to={this.getLinkTo()}>
              <Button
                size="sm"
                variant="outline-success"
                className="text-uppercase"
                onClick={recordAddNewStore}
              >
                Add a store
              </Button>
            </Link>
          </div>
          <SearchResults
            onCardClick={card => this.onCardClick(card)}
            isLoading={this.state.isLoading}
            results={closeByResults}
            center={this.state.center}
          />
        </div>
      </div>
    );
  }
}

export default Homepage;
