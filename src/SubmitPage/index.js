import React from "react";
import { Link } from "react-router-dom";
import SubmitForm from "./SubmitForm";

export default function SubmitPage() {
  return (
    <div>
      <div className="container">
        <h4>Store Status</h4>
    </div>
      <SubmitForm />
      <div className="container">
        <Link to="/">Go back</Link>
      </div>
    </div>
  );
}
