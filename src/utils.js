import React from "react";
import { withRouter } from "react-router-dom";

class ScrollToTopOnMount extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return null;
  }
}

export const ScrollToTop = withRouter(ScrollToTopOnMount);

// The API key is restricted through HTTP referer rules.
export const GOOGLE_API_KEY = "AIzaSyB9hwI7b4677POloj5DpmDXaliqU5Dp8sA";

export const geocodeByLatlng = latlng => {
  const geocoder = new window.google.maps.Geocoder();
  return new Promise(resolve => {
    geocoder.geocode({ location: latlng }, (results, status) => {
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

export const iconSvgs = {
  default:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56.5 96.71"><defs><style>.a{fill:#ff4646;stroke:#d73533;stroke-miterlimit:10;stroke-width:2px;}.b{fill:#590000;}</style></defs><title>RED_pin</title><path class="a" d="M123.69,82.16A31.44,31.44,0,0,1,120.46,96c-1.7,3.34-3.58,6.58-5.41,9.84-1.51,2.71-3.07,5.38-4.59,8.08a103.78,103.78,0,0,0-6.67,15.57,153.65,153.65,0,0,0-5.1,17.37,20.74,20.74,0,0,1-.74,2.4,1.22,1.22,0,0,1-1.24.79c-1.34.08-1.7-.19-2.09-1.56-.6-2.14-1.05-4.32-1.62-6.47a145.07,145.07,0,0,0-4.91-15.4c-1.19-3-2.34-6.1-3.74-9s-3.13-5.91-4.77-8.83-3.3-5.7-4.94-8.56a42.67,42.67,0,0,1-4-8.69,26.7,26.7,0,0,1-1.25-6.13c-.09-1.38-.23-2.76-.21-4.13a24.72,24.72,0,0,1,2.23-9.78,25.23,25.23,0,0,1,5.44-7.91,28.67,28.67,0,0,1,8.87-6,26.46,26.46,0,0,1,5.63-1.76,25,25,0,0,1,6.4-.37,27.35,27.35,0,0,1,7,1.45A30.14,30.14,0,0,1,114,62.1a25.63,25.63,0,0,1,7.21,9.27A24.46,24.46,0,0,1,123.4,79C123.51,80,123.6,81.1,123.69,82.16Z" transform="translate(-68.19 -54.37)"/><circle class="b" cx="28.31" cy="28.13" r="10.5"/></svg>',
  highlighted:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56.5 96.71"><defs><style>.a{fill:#1fa01f;stroke:#126828;stroke-miterlimit:10;stroke-width:2px;}.b{fill:#143f25;}</style></defs><title>GREEN_pin</title><path class="a" d="M123.69,84.16A31.44,31.44,0,0,1,120.46,98c-1.7,3.34-3.58,6.58-5.41,9.84-1.51,2.71-3.07,5.38-4.59,8.08a103.78,103.78,0,0,0-6.67,15.57,153.65,153.65,0,0,0-5.1,17.37,20.74,20.74,0,0,1-.74,2.4,1.22,1.22,0,0,1-1.24.79c-1.34.08-1.7-.19-2.09-1.56-.6-2.14-1.05-4.32-1.62-6.47a145.07,145.07,0,0,0-4.91-15.4c-1.19-3-2.34-6.1-3.74-9s-3.13-5.91-4.77-8.83-3.3-5.7-4.94-8.56a42.67,42.67,0,0,1-4-8.69,26.7,26.7,0,0,1-1.25-6.13c-.09-1.38-.23-2.76-.21-4.13a24.72,24.72,0,0,1,2.23-9.78,25.23,25.23,0,0,1,5.44-7.91,28.67,28.67,0,0,1,8.87-6,26.46,26.46,0,0,1,5.63-1.76,25,25,0,0,1,6.4-.37,27.35,27.35,0,0,1,7,1.45A30.14,30.14,0,0,1,114,64.1a25.63,25.63,0,0,1,7.21,9.27A24.46,24.46,0,0,1,123.4,81C123.51,82,123.6,83.1,123.69,84.16Z" transform="translate(-68.19 -56.37)"/><circle class="b" cx="28.31" cy="28.13" r="10.5"/></svg>'
};

export const convertSvgUrl = svg => {
  return "data:image/svg+xml;charset=UTF-8;base64," + btoa(svg);
};

export const isStoreType = types => {
  const invalidTypes = [
    "route",
    "political",
    "locality",
    "street_address",
    "premise"
  ];
  return types && !types.filter(type => invalidTypes.indexOf(type) >= 0).length;
};
