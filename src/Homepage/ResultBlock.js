import React from "react";
import { Link } from "react-router-dom";

/**
{
  Review Id: "1",
  User IP: "2001:569:7c22:1500:d5d2:9387:9280:31bc",
  Timestamp: "2020-03-27T00:00:00Z",
  Latitude: "12.919361",
  Longitude: "77.614434",
  Name: "Dukaan",
  Manual Address: "Near Domlur flyover",
  Category: "Kirana",
  Opening Time: "9:00",
  Closing Tme: "21:00",
  Notes: "Milk out of stock"
}
*/

function ResultBlock(props) {
  return (
    <div className="my-3">
      <h5>{props.Name}</h5>
      <h6>{props["Manual Address"]}</h6>
      <div>
        <span>{props.Notes}</span> <strong>{props.Timestamp}</strong>
      </div>
      <div>
        <span>
          <Link to="/submit">Share your experience</Link>
        </span>
      </div>
    </div>
  );
}

export default ResultBlock;
