import React from 'react';
import LocationSearchControl from './Input';
import LocationSelectorMap from '../Maps/LocationSelectorMap';

class LocationSelectorMapWithSearch extends React.Component {
  render() {
    return <>
      <LocationSearchControl
        onSearchSuccess={this.props.onSearchSuccess}
        value={this.props.value}
        currentLocation={this.props.currentLocation}
        onGeolocationClicked={this.props.onGeolocationClicked}
        activateInput={this.props.activateInput}
      />
      <LocationSelectorMap
        height={this.props.height}
        position={this.props.position || this.props.currentLocation}
        currentLocation={this.props.currentLocation}
        isMarkerShown={this.props.isMarkerShown}
        onBoundsChanged={this.props.onBoundsChanged}
        onMarkerDragged={this.props.onMarkerDragged}
        onPositionChanged={this.props.onPositionChanged}
      />
    </>
  }
}
export default LocationSelectorMapWithSearch;