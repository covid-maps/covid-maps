import React from "react";
import { Link } from "react-router-dom";
import { ScrollToTopOnMount } from "../utils";

function AboutPage() {
  return (
    <div className="container py-5 about-page">
      <ScrollToTopOnMount />
      <h3>About</h3>
      <p>
        Covid Maps is a crowd sourced app that helps you track the latest
        information on essential services operating around you during covid-19
        shutdowns. <Link to="/update">Share an update</Link> on a store near you
        and help others!
      </p>
      <p>
        We are a small team of volunteers based in Bengaluru, San Francisco and
        Vancouver.
      </p>
      <h3>Contribute</h3>
      <p>
        We are always looking for volunteers that can help with operations and
        technology. Join our <a href="https://t.me/covidmaps">Telegram group</a>{" "}
        and hit us up.
      </p>
      <h3>Privacy Policy</h3>
      <p>
        We collect your IP address when you update information on a store. This
        helps us identify the authenticity of the submission. No other personal
        information is collected.
      </p>
    </div>
  );
}

export default AboutPage;
