import React from "react";
import { Link } from "react-router-dom";
import Map from "./Map";

function SpecLink() {
  return (
    <div className="my-3">
      <small>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://excalidraw.com/#json=5185613305217024,Or41kGO8gujpVcdLs6KDww"
        >
          Spec
        </a>
      </small>
    </div>
  );
}

function Homepage() {
  return (
    <div>
      <h1>
        Home <Link to="/submit">Submit</Link>
      </h1>
      <Map width={"100%"} height={300} />
      <SpecLink />
    </div>
  );
}

export default Homepage;
