import React from "react";
import SearchResults from "./SearchResults";
import MissingBlock from "./MissingBlock";
import { ScrollToTopOnMount, isStoreType } from "../utils";
import * as api from "../api";
import { getDistance } from "geolib";
import MapWithSearch from "../MapWithSearch";

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
    const grouped = Object.values(results.reduce(function (obj, result) {

      var length = result.length;

      if (!obj.hasOwnProperty(result["Place Id"] || result["Store Name"])) {
        obj[result["Place Id"] || result["Store Name"]] = [];
      }

      obj[result["Place Id"] || result["Store Name"]].push(result);

      return obj;

    }, {})).map(
      entries => ({
        name: entries[0]["Store Name"],
        placeId: entries[0]["Place Id"],
        lat: entries[0].Latitude,
        lng: entries[0].Longitude,
        entries: entries.sort((a, b) => b.Timestamp - a.Timestamp).reverse()
      })
    );
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

  render() {
    let missingBlock = null;
    if (this.isMissingLocationInformation(this.state.searchResult)) {
      const storeLocation = this.state.searchResult;
      missingBlock = (
        <MissingBlock
          missing={true}
          result={{
            name: storeLocation.name,
            // TODO: first comma thing with the name
            entries: [
              {
                "Store Name": storeLocation.name,
                Latitude: storeLocation.latLng.lat,
                Longitude: storeLocation.latLng.lng,
                "Place Id": storeLocation.place_id,
                City: storeLocation.city,
                Locality: storeLocation.locality,
                Address: storeLocation.address
              }
            ]
          }}
        ></MissingBlock>
      );
    }

    return (
      <div>
        <ScrollToTopOnMount />
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
        <div className="m-3">
          {missingBlock}
          <h6 className="text-uppercase font-weight-bold mb-3">
            Stores Nearby
          </h6>
          <SearchResults
            onCardClick={card => this.onCardClick(card)}
            isLoading={this.state.isLoading}
            results={this.state.results.filter(
              result => result.distance < 500000
            )}
            center={this.state.center}
          />
        </div>
      </div>
    );
  }
}

export default Homepage;
