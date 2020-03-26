import React from "react";
import { Link } from "react-router-dom";
import Maps from "./Maps";
import Geolocation from "./Geolocation";

function Homepage() {
  return (
    <div>
      <h1>
        Home <Link to="/submit">Submit</Link>
      </h1>
      <Maps width={"100%"} height={500} />
      <Geolocation></Geolocation>
    </div>
  );
}

export default Homepage;
