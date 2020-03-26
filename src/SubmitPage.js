import React from "react";
import { Link } from "react-router-dom";
import Map from "./Map";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function SubmitForm() {
  return (
    <Form
      className="my-3"
      onSubmit={e => {
        e.preventDefault();
      }}
    >
      <Form.Group controlId="formBasicStore">
        <Form.Label>Store</Form.Label>
        <Form.Control type="text" placeholder="Enter store name" />
      </Form.Group>

      <Form.Group controlId="formBasicLocation">
        <Form.Label>Location</Form.Label>
        <Form.Control type="text" placeholder="Location / Address" />
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
      <h3>
        Submit <Link to="/">Go back</Link>
      </h3>
      <Map width={"100%"} height={300} />
      <SubmitForm />
    </div>
  );
}
