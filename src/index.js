import React from "react";
import ReactDOM from "react-dom";
import * as Sentry from "@sentry/browser";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { createStore, applyMiddleware } from "redux";
import reducer from "./reducers";
import promise from "redux-promise-middleware";
import { Provider } from "react-redux";

if (process.env.NODE_ENV !== "development") {
  Sentry.init({
    dsn: "https://6fe517461b7b4a37bee8795a6c233efb@sentry.io/5181458"
  });
}

const store = applyMiddleware(promise)(createStore)(reducer);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
