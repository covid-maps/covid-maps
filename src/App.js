import React, { useState } from "react";
import { Router, Switch, Route, Link } from "react-router-dom";
import { createBrowserHistory } from "history";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Homepage from "./Homepage";
import SubmitPage from "./SubmitPage";
import AboutPage from "./AboutPage";
import LocationSelectionPage from "./LocationSelectionPage";
import { ScrollToTop } from "./utils";
import { Navbar, Button } from "react-bootstrap";
import PWAPrompt from "react-ios-pwa-prompt"
import Nav from "react-bootstrap/Nav";
import ReactGA from "react-ga";
import logo from "./Logo.svg";

const history = createBrowserHistory();
if (process.env.NODE_ENV !== "development") {
  ReactGA.initialize("UA-162047555-1");
  ReactGA.pageview(window.location.pathname);
  history.listen(location => {
    ReactGA.set({ page: location.pathname });
    ReactGA.pageview(location.pathname);
  });
}

function addToHomeScreen(pwaPromptChangeState) {
  if (['iPhone', 'iPad', 'iPod'].includes(navigator.platform)) {
    pwaPromptChangeState(false)
    process.nextTick(() => {
      pwaPromptChangeState(true)
    })
  } else {
    if (window.deferredPrompt) {
      window.deferredPrompt.prompt()
    }
  }

}

function AppNavbar() {
  const [pwaPromptState, pwaPromptChangeState] = useState(false)
  const [a2hsButtonState, a2hsButtonChangeState] = useState(false)
  //Adds the `deferredPrompt` object to the window.
  window.addEventListener('beforeinstallprompt', function (event) {
    a2hsButtonChangeState(true)
    event.preventDefault();
    window.deferredPrompt = event
  });
  return (
    <>
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
        {
          a2hsButtonState &&
          <Button
            size="sm"
            variant="outline-success"
            className="ml-auto a2hs-button"
            onClick={() => addToHomeScreen(pwaPromptChangeState)}
          >
            Add To Home Screen
      </Button>
        }
      </Navbar>
      {
        pwaPromptState &&
        <PWAPrompt
          debug={true}
          promptOnVisit={50}
          timesToShow={50}
          delay={200}
          copyClosePrompt="Close"
          permanentlyHideOnDismiss={false} />
      }

    </>
  );
}

function App() {
  return (
    <Router history={history}>
      <div className="App">
        <ScrollToTop />
        <AppNavbar />
        <div className="page">
          <Switch>
            <Route path="/update" component={SubmitPage} />
            <Route path="/location" component={LocationSelectionPage} />
            <Route path="/about" component={AboutPage} />
            <Route path="/" component={Homepage} />
          </Switch>
        </div>
        <footer className="m-0 p-0">
          <div className="container py-4 text-center text-uppercase">
            <Link to="/">Home</Link> ·{" "}
            <Link to="/update">Submit an update</Link> ·{" "}
            <Link to="/about">About</Link>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
