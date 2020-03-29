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
      <Map {...props} />
    </>
  );
}

export default MapWithSearch;
