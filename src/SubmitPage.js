import React from "react";
import { Link } from "react-router-dom";
import Maps from "./Maps";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function SubmitForm() {
  return (
    <Form className="my-3">
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
      <h1>
        Submit <Link to="/">Go back</Link>
      </h1>
      <Maps width={"100%"} height={500} />
      <SubmitForm />
    </div>
  );
}
