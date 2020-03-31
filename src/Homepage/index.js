import React from "react";
import SearchResults from "./SearchResults";
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
    searchResultLatlng: undefined
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
        lat: entries[0].Latitude,
        lng: entries[0].Longitude,
        entries: _.sortBy(entries, ["Timestamp"]).reverse()
      })
    );
    return this.calculateGroupDistance(grouped);
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
    return (
      <div>
        <ScrollToTopOnMount />
        <MapWithSearch
          value=""
          onSuccess={({ latLng }) => {
            this.setState(
              { searchResultLatlng: latLng },
              this.onBoundsChanged(latLng)
            );
          }}
          style={{ height: 400 }}
          position={this.state.searchResultLatlng}
          locations={this.state.markers}
          onBoundsChanged={center => this.onBoundsChanged(center)}
          onPositionChanged={position => this.setState({ searchResultLatlng: position })}
        />
        <div className="m-3">
          <h6 className="text-uppercase font-weight-bold mb-3">
            Stores Nearby
          </h6>
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
