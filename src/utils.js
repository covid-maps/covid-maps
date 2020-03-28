import React from "react";

export class ScrollToTopOnMount extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return null;
  }
}

// The API key is restricted through HTTP referer rules.
export const GOOGLE_API_KEY = "AIzaSyB9hwI7b4677POloj5DpmDXaliqU5Dp8sA";

export const geocodeByLatlng = latlng => {
  const geocoder = new window.google.maps.Geocoder();
  return new Promise(resolve => {
    geocoder.geocode({ location: latlng }, (results, status) => {
      console.log(status);
      resolve(results);
    });
  });
};

export function getAddressComponent(addressComponents, component) {
  const filtered = addressComponents
    .filter(c => c.types.find(t => t === component))
    .map(c => c.long_name);
  return filtered.length ? filtered[0] : "";
}
