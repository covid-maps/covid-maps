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
import ReactGA from "react-ga";
import logo from "./Logo.svg";

function AppNavbar() {
  return (
    <Navbar bg="light" variant="light" fixed="top">
      <Navbar.Brand className="navbar-brand">
        <Link to="/">
          <img
            alt="Covid Maps"
            src={logo}
            height="24"
            className="d-inline-block align-top"
          />{" "}
        </Link>
      </Navbar.Brand>
      <Nav className="ml-auto">
        <Link to="/update">
          <Button size="sm" variant="success" className="text-uppercase">
            <strong>Submit update</strong>
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
            <Route path="/update" component={SubmitPage} />
            <Route path="/about" component={AboutPage} />
            <Route path="/" component={Homepage} />
          </Switch>
        </div>
        <footer className="m-0 p-0">
          <div className="container py-4 text-center text-uppercase">
            <Link to="/">Home</Link> · <Link to="/update">Submit an update</Link> ·{" "}
            <Link to="/about">About</Link>
          </div>
        </footer>
      </div>
    </Router>
  );
}

function initializeReactGA() {
  ReactGA.initialize("UA-162047555-1");
  ReactGA.pageview("/");
}

initializeReactGA();
