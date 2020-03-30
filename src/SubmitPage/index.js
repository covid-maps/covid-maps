import React from "react";
import SubmitForm from "./SubmitForm";
import { ScrollToTopOnMount } from "../utils";

export default function SubmitPage(props) {
  return (
    <div>
      <ScrollToTopOnMount />
      <SubmitForm {...props} />
    </div>
  );
}
