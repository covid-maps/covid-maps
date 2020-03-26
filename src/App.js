import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import Homepage from "./Homepage";
import SubmitPage from "./SubmitPage";

export default function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/submit">
            <SubmitPage />
          </Route>
          <Route path="/">
            <Homepage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
