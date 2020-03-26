import React from "react";
import { Link } from "react-router-dom";
import Maps from "./Maps";

export default function SubmitPage() {
  return (
    <div>
      <h1>
        Submit <Link to="/">Go back</Link>
      </h1>
      <Maps width={"100%"} height={500} />
    </div>
  );
}
