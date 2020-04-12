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
        onBoundsChanged={this.props.onBoundsChanged}
        onMarkerDragged={this.props.onMarkerDragged}
        onPositionChanged={this.props.onPositionChanged}
      />
    </>
  }
}
export default LocationSelectorMapWithSearch;