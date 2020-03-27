import React from "react";
import Form from "react-bootstrap/Form";

class LocationSearchControl extends React.Component {
  render() {
    return (
      <Form.Control
        size="sm"
        type="text"
        placeholder="Search by store name, address or landmark"
      />
    );
  }
}

export default LocationSearchControl;
