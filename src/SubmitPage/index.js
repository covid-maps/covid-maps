import React from "react";
import { Link } from "react-router-dom";
import SubmitForm from "./SubmitForm";

export default function SubmitPage() {
  return (
    <div>
      <div className="container">
        <h3>Update Store Details</h3>
      </div>
      <SubmitForm />
      <div className="container">
        <Link to="/">Go back</Link>
      </div>
    </div>
  );
}
