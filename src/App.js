import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Homepage from "./Homepage";
import SubmitPage from "./SubmitPage";
import AboutPage from "./AboutPage";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import logo from "./logo192.png";

export default function App() {
  return (
    <Router>
      <div className="App">
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="/">
            <img
              alt="Logo"
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{" "}
            covidmaps.in
          </Navbar.Brand>
          <Nav className="ml-auto">
            <Nav.Link href="/submit">Submit</Nav.Link>
          </Nav>
        </Navbar>
        <div className="page">
          <Switch>
            <Route path="/submit">
              <SubmitPage />
            </Route>
            <Route path="/about">
              <AboutPage />
            </Route>
            <Route path="/">
              <Homepage />
            </Route>
          </Switch>
        </div>
        <footer>
          <div className="container py-4">
            <Link to="/about">About</Link>
          </div>
        </footer>
      </div>
    </Router>
  );
}
