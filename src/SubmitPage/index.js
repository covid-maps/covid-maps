import React from "react";
import { Link } from "react-router-dom";
import SubmitForm from "./SubmitForm";
import { ScrollToTopOnMount } from "../utils";

export default function SubmitPage(props) {
  return (
    <div>
      <ScrollToTopOnMount />
      <div className="container">
        <h4>Store Status</h4>
      </div>
      <SubmitForm {...props} />
      <div className="container">
        <Link to="/">Go back</Link>
      </div>
    </div>
  );
}
