import React from "react";
import SubmitForm from "./SubmitForm";
import { ScrollToTopOnMount } from "../utils";
import ReactGA from "react-ga";

export default function SubmitPage(props) {
  ReactGA.pageview("/Update");
  return (
    <div>
      <ScrollToTopOnMount />
      <SubmitForm {...props} />
    </div>
    
  );
}
