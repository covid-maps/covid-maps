import React from 'react';
import LocationSearchControl from './Input';
import LocationSelectorMap from '../Maps/LocationSelectorMap';

const current = { lat: 49.281376, lng: -123.111382 };

class LocationSelectorMapWithSearch extends React.Component {
  render() {
    return <>
      <LocationSearchControl
        onSearchSuccess={this.props.onSearchSuccess}
        value={this.props.value}
        // TODO: fix current
        currentLocation={current}
        onGeolocation={this.props.getGeolocation}
        activateInput={this.props.activateInput}
      />
      <LocationSelectorMap
        height={this.props.height}
        // TODO: fallback to current
        position={this.props.position || current}
        // TODO: fix current
        currentLocation={current}
        isMarkerShown={this.props.isMarkerShown}
        onBoundsChanged={this.props.onBoundsChanged}
        onMarkerDragged={this.props.onMarkerDragged}
        onPositionChanged={this.props.onPositionChanged}
      />
    </>
  }
}
export default LocationSelectorMapWithSearch;