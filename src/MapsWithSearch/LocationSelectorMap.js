import React from 'react';
import LocationSearchControl from './Input';
import LocationSelectorMap from '../Maps/LocationSelectorMap';

class LocationSelectorMapWithSearch extends React.Component {
  render() {
    return <>
      <LocationSearchControl
        onSearchSuccess={this.props.onSearchSuccess}
        value={this.props.value}
        currentLocation={this.props.geoLocation || this.props.ipLocation}
        onGeolocationFound={this.props.onGeolocationFound}
        activateInput={this.props.activateInput}
      />
      <LocationSelectorMap
        height={this.props.height}
        markerPosition={this.props.markerPosition || this.props.geoLocation || this.props.ipLocation}
        geoLocation={this.props.geoLocation}
        ipLocation={this.props.ipLocation}
        onMarkerDragged={this.props.onMarkerDragged}
      />
    </>
  }
}
export default LocationSelectorMapWithSearch;