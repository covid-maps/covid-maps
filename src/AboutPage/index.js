import React from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faTimes, faWhatsappSquare } from "@fortawesome/free-solid-svg-icons";

function NewTabLink({ href, children }) {
  return (
    <a href={href} rel="noopener noreferrer" target="_blank">
      {children}
    </a>
  );
}

function AboutPage() {
  return (
    <div className="container p-4 about-page">
      <h4 className="text-uppercase mb-1">About</h4>
      <p className="text-black-60">
        Covid Maps is a crowd-sourced app that helps you track the latest
        information on essential services operating around you during the
        COVID-19 shutdowns. <Link to="/update">Add an update</Link> about a
        store near you and help others!
      </p>
      <p className="text-black-60">
        We are a small team of volunteers in Bengaluru, San Francisco and
        Vancouver.
      </p>
      <h4 className="mt-4 text-uppercase mb-1">Contribute</h4>
      <p className="text-black-60">
        We are looking for volunteers that can help with technology and
        outreach.
      </p>
      <p>
        <a href="https://github.com/covid-maps/covid-maps">
          <Button variant="info">
            <i className="fab fa-github" /> Join us on GitHub
          </Button>
        </a>
      </p>
      <p>
        <a href="https://chat.whatsapp.com/HzZT0gMYoYYEDDjj2LQUD8">
          <Button variant="info">
            <i className="fab fa-whatsapp" /> Join our Developer group
          </Button>
        </a>
      </p>
      <p>
        <a href="https://chat.whatsapp.com/BXh2FuYjW55Ee26xuzoWcw">
          <Button variant="info">
            <i className="fab fa-whatsapp" /> Join our Outreach group
          </Button>
        </a>
      </p>
      <h4 className="mt-4 text-uppercase mb-1">Privacy Policy</h4>
      <p className="text-black-60">
        We collect your IP address when you update information on a store. This
        helps us identify the authenticity of the submission. No other personal
        information is collected.
      </p>
    </div>
  );
}

export default AboutPage;
