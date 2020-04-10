import React from 'react';
import LocationSearchControl from './Input';
import HomepageMap from '../Maps/HomepageMap';

class HomepageMapWithSearch extends React.Component {
  render() {
    return <>
      <LocationSearchControl
        onSearchSuccess={this.props.onSearchSuccess}
        value={this.props.value}
        currentLocation={this.props.currentLocation}
        onGeolocationFound={this.props.onGeolocationFound}
        activateInput={this.props.activateInput}
      />
      <HomepageMap
        style={this.props.style}
        currentLocation={this.props.currentLocation}
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