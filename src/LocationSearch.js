import React from "react";
import Form from "react-bootstrap/Form";

class LocationSearchControl extends React.Component {
  render() {
    return (
      <Form.Control
        size="sm"
        type="text"
        placeholder="Address/landmark if not found on Google Maps"
      />
    );
  }
}

export default LocationSearchControl;
