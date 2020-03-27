import React from "react";
import { Link } from "react-router-dom";
import Map from "./Map";
import LocationSearchControl from "./LocationSearch";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Col } from "react-bootstrap";


function SubmitForm() {
  return (
    <Form
      className="my-3"
      onSubmit={e => {
        e.preventDefault();
      }}
    >

      <Form.Group controlId="formBasicLocation">
        <Form.Label>Location</Form.Label>
        <LocationSearchControl text={"text"} />
      </Form.Group>

      <Map width={"100%"} height={200} />

      <Form.Group controlId="formBasicStore">
        <Form.Label>Store Name</Form.Label>
        <Form.Control
          size="sm"
          type="text"
          placeholder="Enter store name"
          required
        />
      </Form.Group>

      <Form.Group controlId="formBasicServiceType">
        <Form.Label>Service Type</Form.Label>
        <Form.Control size="sm" as="select">
          <option>Kirana Store</option>
          <option>Supermarket</option>
          <option>Restaurant</option>
          <option>ATM</option>
          <option>Clinic</option>
          <option>Pharmacy</option>
          <option>Other</option>
        </Form.Control>
      </Form.Group>

      <Form.Row>
        <Col>
          <Form.Group controlId="formBasicOpenTimings">
            <Form.Label>Opening Time</Form.Label>
             <Form.Control size="sm" type="time" step = "60" placeholder="Open time" />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="formBasicCloseTimings">
            <Form.Label>Closing Time</Form.Label>
            <Form.Control size="sm" type="time" placeholder="Closing time" />
          </Form.Group>
        </Col>
      </Form.Row>
      <Form.Group controlId="formBasicCrowdDetails">
        <Form.Label>Safety</Form.Label>
        <Form.Control
          size="sm"
          type="text"
          placeholder="Queues at store and Covid-19 precautions"
        />
      </Form.Group>

      <Form.Group controlId="formBasicComments">
        <Form.Label>Useful Information</Form.Label>
        <Form.Control
          size="sm"
          type="text"
          placeholder="Contact no./Stock availability/delivery options"
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

export default function SubmitPage() {
  return (
    <div>
      <h3>Update Store Details</h3>
      <SubmitForm />
      <Link to="/">
        {" "}
        <h5> Go back</h5>
      </Link>
    </div>
  );
}
