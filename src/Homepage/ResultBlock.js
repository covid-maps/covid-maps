import React from "react";
import { Link } from "react-router-dom";

function ResultBlock(props) {
  return (
    <div className="my-3">
      <h5>{props["Store Name"]}</h5>
      <h6>{props["Manual Address"]}</h6>
      <div>
        <span>
          <Link to="/submit">Share your experience</Link>
        </span>
      </div>
      <div class="card">
        <div class="card-header">
          <strong>{props["Timestamp"]}</strong>
        </div>
        <div class="card-body">
          <table class="table">
            <tr>
              <th scope="row">Notes</th>
              <td>{props["Useful Information"]}</td>
            </tr>
            <tr>
              <th scope="row">Safety</th>
              <td>{props["Safety"]}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ResultBlock;
