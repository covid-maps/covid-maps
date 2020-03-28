import React from "react";
import SearchResults from "./SearchResults";
import GoogleMap from "../Map";

function Homepage() {
  return (
    <div>
      {/* <Map width={"100%"} height={400} /> */}
      <GoogleMap style={{ height: 500 }} />
      <div className="container">
        <SearchResults />
      </div>
    </div>
  );
}

export default Homepage;
