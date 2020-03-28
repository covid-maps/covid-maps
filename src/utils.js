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
