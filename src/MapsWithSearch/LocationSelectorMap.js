import React from 'react';
import LocationSearchControl from './Input';
import LocationSelectorMap from '../Maps/LocationSelectorMap';

class LocationSelectorMapWithSearch extends React.Component {
  render() {
    return <>
      <LocationSearchControl
        onSearchSuccess={this.props.onSearchSuccess}
        value={this.props.value}
        currentLocation={this.props.currentLocation.latLng}
        onGeolocationFound={this.props.onGeolocationFound}
        activateInput={this.props.activateInput}
      />
      <LocationSelectorMap
        height={this.props.height}
        markerPosition={this.props.markerPosition || this.props.currentLocation.latLng}
        currentLocation={this.props.currentLocation}
        onMarkerDragged={this.props.onMarkerDragged}
      />
    </>
  }
}
export default LocationSelectorMapWithSearch;