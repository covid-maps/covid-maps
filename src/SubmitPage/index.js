import React from "react";
import SubmitForm from "./SubmitForm";
import { ScrollToTopOnMount } from "../utils";

export default function SubmitPage(props) {
  return (
    <div>
      <ScrollToTopOnMount />
      <div className="container">
        <h4>Update Store Status</h4>
      </div>
      <SubmitForm {...props} />
    </div>
  );
}
