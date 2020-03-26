import React from "react";
import { Link } from "react-router-dom";
import Map from "./Map";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {Col} from "react-bootstrap";

function SubmitForm() {
  return (
    <Form
      className="my-3"
      onSubmit={e => {
        e.preventDefault();
      }}
    >
      <Form.Group controlId="formBasicStore">
        <Form.Label>Store Name</Form.Label>
        <Form.Control size = "sm" type="text" placeholder="Enter store name" required/>
      </Form.Group>

      <Form.Group controlId="formBasicLocation">
        <Form.Label>Location</Form.Label>
        <Form.Control size = "sm" type="text" placeholder="Address/landmark if not found on Google Maps" />
      </Form.Group>
      
      <Form.Group controlId="formBasicServiceType">
        <Form.Label>Service Type</Form.Label>
        <Form.Control size = "sm" as="select" multiple>
      <option>Kirana Store</option>
      <option>Supermarket</option>
      <option>Restaurant</option>
      <option>ATM</option>
      <option>Clinic</option>
        </Form.Control>
      </Form.Group>
      
      <Form.Row>
    <Col>
      <Form.Group controlId="formBasicOpenTimings">
        <Form.Label>Opening Time</Form.Label>
        <Form.Control size = "sm" type="text" placeholder="Open time" />
      </Form.Group>
      </Col>
    <Col>
      <Form.Group controlId="formBasicCloseTimings">
      <Form.Label>Closing Time</Form.Label>
        <Form.Control size = "sm" type="text" placeholder="Closing time" />
      </Form.Group>
      </Col>
  </Form.Row> 
  <Form.Group controlId="formBasicCrowdDetails">
        <Form.Label>Safety</Form.Label>
        <Form.Control size = "sm" type="text" placeholder="Crowd/social distancing information" />
      </Form.Group>

  <Form.Group controlId="formBasicComments">
        <Form.Label>Comments</Form.Label>
        <Form.Control size = "sm" type="text" placeholder="Stock information/special hours/etc." />
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
      <hr />
      <h3>
        Add Store Details 
      </h3>
      <Map width={"100%"} height={300} />
      <SubmitForm />
      <Link to="/"> <h5> Go back</h5></Link>
    </div>
  );
}
