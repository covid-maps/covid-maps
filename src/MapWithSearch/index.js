import React from "react";
import Map from "../Map";
import LocationSearchControl from "./LocationSearch";

function MapWithSearch(props) {
  return (
    <>
      <div className="container">
        <LocationSearchControl
          onSuccess={props.onSuccess}
          value={props.value}
        />
      </div>
      <Map
        style={props.style}
        position={props.position}
        locations={props.locations}
        onBoundsChanged={props.onBoundsChanged}
        onMarkerDragged={props.onMarkerDragged}
      />
    </>
  );
}

export default MapWithSearch;
