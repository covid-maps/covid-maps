import React from "react";
import Map from "../Map";
import SearchResults from "./SearchResults";

function Homepage() {
  return (
    <div>
      <Map width={"100%"} height={400} />
      <div className="container">
        <SearchResults />
      </div>
    </div>
  );
}

export default Homepage;
