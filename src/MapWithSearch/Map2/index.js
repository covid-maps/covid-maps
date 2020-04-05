import React, { useRef } from "react";

function GoogleMap() {
  const refMap = useRef(null);
  return <div id="google-map" ref={refMap} />;
}
