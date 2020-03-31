import React from "react";
import { Link } from "react-router-dom";
import { ScrollToTopOnMount } from "../utils";

function AboutPage() {
  return (
    <div className="container p-4 about-page">
      <ScrollToTopOnMount />
      <h4 className="text-uppercase mb-1">About</h4>
      <p className="text-black-50">
        Covid Maps is a crowd-sourced app that helps you track the latest
        information on essential services operating around you during the
        COVID-19 shutdowns. <Link to="/update">Add an update</Link> about a
        store near you and help others!
      </p>
      <p className="text-black-50">
        We are a small team of volunteers in Bengaluru, San Francisco and
        Vancouver.
      </p>
      <h4 className="mt-4 text-uppercase mb-1">Contribute</h4>
      <p className="text-black-50">
        We are looking for volunteers that can help with operations and
        technology. Join our <a href="https://t.me/covidmaps" target="_blank">Telegram group</a>{" "}
        or find us on <a href="https://github.com/arjun27/covid-maps" target="_blank">GitHub</a>
        .
      </p>
      <h4 className="mt-4 text-uppercase mb-1">Privacy Policy</h4>
      <p className="text-black-50">
        We collect your IP address when you update information on a store. This
        helps us identify the authenticity of the submission. No other personal
        information is collected.
      </p>
    </div>
  );
}

export default AboutPage;
