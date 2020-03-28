import React from "react";
import { Link } from "react-router-dom";

function AboutPage() {
  return (
    <div className="container py-5 about-page">
      <h3>About</h3>
      <p>
        covidmaps.in is a crowd sourced app to find out where to get essential
        goods and services around you in these tough times.{" "}
        <Link to="/submit">Submit a report</Link> and help others!
      </p>
      <p>
        We are a small team of volunteers based in Bengaluru, San Francisco and
        Vancouver.
      </p>
      <h3>Contribute</h3>
      <p>
        We are always looking for volunteers that can help with operations and
        technology. Join our Telegram group and hit us up.
      </p>
      <h3>Privacy Policy</h3>
      <p>
        We collect your IP address when you submit a new report. This helps us
        identify the authenticity of the submission. No other personal
        information is collected.
      </p>
    </div>
  );
}

export default AboutPage;
