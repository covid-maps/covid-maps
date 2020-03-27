import React from "react";
import { Link } from "react-router-dom";
import SubmitForm from "./SubmitForm";

export default function SubmitPage() {
  return (
    <div>
      <h3>Update Store Details</h3>
      <SubmitForm />
      <Link to="/">
        <h5>Go back</h5>
      </Link>
    </div>
  );
}
