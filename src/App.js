import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
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

function Home() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}
