import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Homepage from "./Homepage";
import SubmitPage from "./SubmitPage";
import AboutPage from "./AboutPage";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import logo from "./logo192.png";

function AppNavbar() {
  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand className="navbar-brand">
        <Link to="/">
          <img
            alt="Logo"
            src={logo}
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{" "}
          <strong>covidmaps</strong>
          <span style={{ color: "#999" }}>.in</span>
        </Link>
      </Navbar.Brand>
      <Nav className="ml-auto">
        <Link to="/submit">
          <Button size="sm" variant="info">
            <strong>Leave an Update</strong>
          </Button>
        </Link>
      </Nav>
    </Navbar>
  );
}

export default function App() {
  return (
    <Router>
      <div className="App">
        <AppNavbar />
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
