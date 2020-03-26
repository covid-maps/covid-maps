import React from "react";
import { Link } from "react-router-dom";
import Maps from "./Maps";

function Homepage() {
  return (
    <div>
      <h1>
        Home <Link to="/submit">Submit</Link>
      </h1>
      <Maps width={500} height={500} />
    </div>
  );
}

export default Homepage;
