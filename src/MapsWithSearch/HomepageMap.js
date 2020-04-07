import React from 'react';
import LocationSearchControl from './Input';
import HomepageMap from '../Maps/HomepageMap';

class HomepageMapWithSearch extends React.Component {
  render() {
    return <>
      <LocationSearchControl
        onSearchSuccess={this.props.onSearchSuccess}
        value={this.props.value}
        // TODO: fix current
        currentLocation={this.props.centerPosition}
        onGeolocation={this.props.getGeolocation}
        activateInput={this.props.activateInput}
      />
      <HomepageMap
        style={this.props.style}
        // TODO: fix current
        currentLocation={this.props.centerPosition}
        locations={this.props.locations}
        selectedLocation={this.props.selectedLocation}
        onMarkerSelected={this.props.onMarkerSelected}
        panToLocation={this.props.panToLocation}
        centerPosition={this.props.centerPosition}
      />
    </>
  }
}

export default HomepageMapWithSearch;