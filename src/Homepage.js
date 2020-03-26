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

function ResultBlock({ name, location, commodity, timestamp }) {
  return (
    <div className="my-4">
      <h3>{name}</h3>
      <h4>{location}</h4>
      <div>
        <span>{commodity}</span> <strong>{timestamp}</strong>
      </div>
    </div>
  );
}

const SEARCH_RESULTS = [
  {
    name: "Safeway",
    location: "Commercial-Broadway",
    commodity: "5 rolls",
    timestamp: "4 hours ago"
  },
  {
    name: "IGA",
    location: "Burrard St",
    commodity: "10 rolls",
    timestamp: "2 hours ago"
  }
];

function Homepage() {
  return (
    <div>
      <h1>
        Home <Link to="/submit">Submit</Link>
      </h1>
      <hr />
      <Map width={"100%"} height={300} />
      {SEARCH_RESULTS.map(result => {
        return <ResultBlock {...result} />;
      })}
      <hr />
      <SpecLink />
    </div>
  );
}

export default Homepage;
