import React from "react";
import SearchResults from "./SearchResults";
import MissingBlock from "./MissingBlock";
import { ScrollToTopOnMount } from "../utils";
import * as api from "../api";
import { getDistance } from "geolib";
import _ from "lodash";
import MapWithSearch from "../MapWithSearch";

class Homepage extends React.Component {
  state = {
    results: [],
    markers: [],
    isLoading: true,
    center: {},
    searchResultLatlng: undefined,
    searchResultLocation: undefined
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
    return _.sortBy(groupedResult, ["distance"]);
  }

  formatResults(results) {
    const groupByFn = result => result["Place Id"] || result["Store Name"];
    const grouped = Object.values(_.groupBy(results, groupByFn)).map(
      entries => ({
        name: entries[0]["Store Name"],
        placeId: entries[0]["Place Id"],
        lat: entries[0].Latitude,
        lng: entries[0].Longitude,
        entries: _.sortBy(entries, ["Timestamp"]).reverse()
      })
    );
    return this.calculateGroupDistance(grouped);
  }

  isMissingLocationInformation(location) {
    return location && location.name && !this.state.results.filter(result => result.placeId === location.place_id).length;
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
    let missingLocation = null;
    if(this.isMissingLocationInformation(this.state.searchResultLocation)) {
      missingLocation = (
        <MissingBlock missing={true} result={{
          name: this.state.searchResultLocation.name,
          entries: [{ 'Store Name': this.state.searchResultLocation.name }]
        }}></MissingBlock>
      );
    }

    return (
      <div>
        <ScrollToTopOnMount />
        <MapWithSearch
          value=""
          onSuccess={({ name, latLng, place_id }) => {
            this.setState({
                searchResultLatlng: latLng,
                searchResultLocation: { name, latLng, place_id }
              },
              this.onBoundsChanged(latLng)
            );
          }}
          style={{ height: 400 }}
          position={this.state.searchResultLatlng}
          locations={this.state.markers}
          onBoundsChanged={center => this.onBoundsChanged(center)}
          onPositionChanged={position => this.setState({ searchResultLatlng: position, searchResultLocation: null })}
        />
        <div className="m-3">
          { missingLocation }
          <SearchResults
            onCardClick={card => this.onCardClick(card)}
            isLoading={this.state.isLoading}
            results={this.state.results}
            center={this.state.center}
          />
        </div>
      </div>
    );
  }
}

export default Homepage;
