import React from "react";
import SearchResults from "./SearchResults";
import GoogleMap from "../Map";

function Homepage() {
  return (
    <div>
      <GoogleMap style={{ height: 400 }} />
      <div className="container">
        <SearchResults />
      </div>
    </div>
  );
}

export default Homepage;
