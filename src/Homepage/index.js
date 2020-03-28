import React from "react";
import SearchResults from "./SearchResults";
import GoogleMap from "../Map";
import { ScrollToTopOnMount } from "../utils";

function Homepage() {
  return (
    <div>
      <ScrollToTopOnMount />
      <GoogleMap style={{ height: 400 }} />
      <div className="container">
        <SearchResults />
      </div>
    </div>
  );
}

export default Homepage;
